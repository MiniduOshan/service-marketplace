<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\ServicePackage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $bookings = Booking::query()
            ->with(['servicePackage.category', 'worker:id,name,phone', 'customer:id,name,phone', 'review'])
            ->when($user->isWorker(), function ($query) use ($user) {
                $query->where('worker_id', $user->id);
            }, function ($query) use ($user) {
                $query->where('customer_id', $user->id);
            })
            ->latest()
            ->paginate(12);

        return response()->json([
            'data' => $bookings,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        $bypassPhoneVerification = app()->environment(['local', 'testing']);

        abort_unless($user?->isCustomer(), 403, 'Only customers can create bookings.');
        abort_unless($bypassPhoneVerification || $user->hasVerifiedPhone(), 403, 'Please verify your phone number before booking.');

        $privileges = \App\Models\Setting::get('privileges', []);
        $bookingPriv = collect($privileges)->firstWhere('key', 'bookings');
        if ($bookingPriv && !$bookingPriv['enabled']) {
            abort(403, 'The booking feature is currently disabled by the administrator.');
        }

        $validated = $request->validate([
            'service_package_id' => ['required', 'exists:service_packages,id'],
            'scheduled_at' => ['required', 'date', 'after:now'],
            'address' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'payment_option' => ['nullable', 'string', 'in:advance,full,after'],
            'photos' => ['nullable', 'array'],
            'photos.*' => ['string'],
        ]);

        $servicePackage = ServicePackage::query()
            ->with('worker')
            ->whereKey($validated['service_package_id'])
            ->firstOrFail();

        abort_unless($servicePackage->is_active, 422, 'This service package is no longer active.');

        $worker = $servicePackage->worker;
        abort_unless($worker && $worker->status === 'Active', 422, 'The service provider is currently unavailable.');
        abort_unless($worker && $worker->verification === 'Verified', 422, 'The service provider is not verified.');

        $hasConflict = Booking::query()
            ->where('worker_id', $worker->id)
            ->where('scheduled_at', $validated['scheduled_at'])
            ->where('status', '!=', 'cancelled')
            ->exists();

        abort_if($hasConflict, 422, 'The service provider is already booked for this time slot.');

        $paymentOption = $validated['payment_option'] ?? 'after';
        $advancePaid = 0.00;

        if ($paymentOption === 'advance') {
            $totalToPay = round($servicePackage->price * 1.05, 2);
            $advancePaid = round($totalToPay / 2, 2);
        } elseif ($paymentOption === 'full') {
            $totalToPay = round($servicePackage->price * 1.05, 2);
            $advancePaid = $totalToPay;
        }

        $booking = DB::transaction(function () use ($user, $servicePackage, $validated, $paymentOption, $advancePaid) {
            $booking = Booking::create([
                'customer_id' => $user->id,
                'worker_id' => $servicePackage->user_id,
                'service_package_id' => $servicePackage->id,
                'scheduled_at' => $validated['scheduled_at'],
                'address' => strip_tags($validated['address']),
                'notes' => isset($validated['notes']) ? strip_tags($validated['notes']) : null,
                'total_price' => $servicePackage->price,
                'status' => 'pending',
                'payment_option' => $paymentOption,
                'advance_paid' => $advancePaid,
                'payout_status' => 'pending',
                'photos' => $validated['photos'] ?? null,
            ]);

            if ($paymentOption === 'advance' || $paymentOption === 'full') {
                $booking->payments()->create([
                    'gateway_reference' => 'pay_' . \Illuminate\Support\Str::random(16),
                    'status' => 'completed',
                    'amount' => $advancePaid,
                    'currency' => 'LKR',
                    'verified_at' => now(),
                ]);
            }

            return $booking;
        });

        \App\Models\Notification::create([
            'user_id' => $booking->worker_id,
            'title' => 'New Booking Request',
            'message' => "You have a new booking request from {$user->name} for {$servicePackage->title}.",
            'type' => 'booking',
            'related_id' => $booking->id,
        ]);

        return response()->json([
            'message' => 'Booking created successfully.',
            'data' => $booking->load(['servicePackage.category', 'worker:id,name', 'customer:id,name', 'payments']),
        ], 201);
    }

    public function cancel(Request $request, Booking $booking): JsonResponse
    {
        $user = $request->user();

        $booking = DB::transaction(function () use ($booking, $user) {
            $lockedBooking = Booking::whereKey($booking->id)->lockForUpdate()->firstOrFail();
            abort_unless($user && ($user->id === $lockedBooking->customer_id || $user->id === $lockedBooking->worker_id), 403, 'You cannot cancel this booking.');
            abort_unless(in_array($lockedBooking->status, ['pending', 'confirmed']), 422, 'Only pending or confirmed bookings can be cancelled.');

            $lockedBooking->update([
                'status' => 'cancelled',
            ]);
            return $lockedBooking;
        });

        $recipientId = ($user->id === $booking->customer_id) ? $booking->worker_id : $booking->customer_id;
        \App\Models\Notification::create([
            'user_id' => $recipientId,
            'title' => 'Booking Cancelled',
            'message' => "Booking #{$booking->id} has been cancelled by {$user->name}.",
            'type' => 'booking',
            'related_id' => $booking->id,
        ]);

        return response()->json([
            'message' => 'Booking cancelled successfully.',
            'data' => $booking->load(['servicePackage.category', 'worker:id,name', 'customer:id,name']),
        ]);
    }

    public function accept(Request $request, Booking $booking): JsonResponse
    {
        $user = $request->user();

        $booking = DB::transaction(function () use ($booking, $user) {
            $lockedBooking = Booking::whereKey($booking->id)->lockForUpdate()->firstOrFail();
            abort_unless($user && $user->id === $lockedBooking->worker_id, 403, 'Only the assigned worker can accept this booking.');
            abort_unless($lockedBooking->status === 'pending', 422, 'Only pending bookings can be accepted.');

            $lockedBooking->update([
                'status' => 'confirmed',
            ]);
            return $lockedBooking;
        });

        \App\Models\Notification::create([
            'user_id' => $booking->customer_id,
            'title' => 'Booking Confirmed',
            'message' => "Your booking request for {$booking->servicePackage->title} has been accepted by {$user->name}.",
            'type' => 'booking',
            'related_id' => $booking->id,
        ]);

        return response()->json([
            'message' => 'Booking accepted successfully.',
            'data' => $booking->load(['servicePackage.category', 'worker:id,name', 'customer:id,name']),
        ]);
    }

    public function complete(Request $request, Booking $booking): JsonResponse
    {
        $user = $request->user();

        $booking = DB::transaction(function () use ($booking, $user) {
            $lockedBooking = Booking::whereKey($booking->id)->lockForUpdate()->firstOrFail();
            abort_unless($user && $user->id === $lockedBooking->worker_id, 403, 'Only the assigned worker can mark this booking as completed.');
            abort_unless($lockedBooking->status === 'confirmed', 422, 'Only confirmed bookings can be completed.');

            $lockedBooking->update([
                'status' => 'completed',
            ]);

            $worker = $lockedBooking->worker;
            $wallet = $worker->wallet()->lockForUpdate()->firstOrCreate([], [
                'balance' => 0.00,
            ]);
            $wallet->increment('balance', $lockedBooking->total_price);

            return $lockedBooking;
        });

        \App\Models\Notification::create([
            'user_id' => $booking->customer_id,
            'title' => 'Booking Completed',
            'message' => "Your service for {$booking->servicePackage->title} has been marked as completed by {$user->name}.",
            'type' => 'booking',
            'related_id' => $booking->id,
        ]);

        return response()->json([
            'message' => 'Booking completed successfully.',
            'data' => $booking->load(['servicePackage.category', 'worker:id,name', 'customer:id,name']),
        ]);
    }

    public function settle(Request $request, Booking $booking): JsonResponse
    {
        $user = $request->user();

        $booking = DB::transaction(function () use ($booking, $user) {
            $lockedBooking = Booking::whereKey($booking->id)->lockForUpdate()->firstOrFail();
            abort_unless($user && ($user->id === $lockedBooking->worker_id || $user->role === 'admin'), 403, 'Unauthorized.');
            abort_unless($lockedBooking->status === 'completed', 422, 'Only completed bookings can be settled.');
            abort_unless($lockedBooking->payout_status === 'pending', 422, 'Payout is already settled or not eligible.');

            $lockedBooking->update([
                'payout_status' => 'settled',
            ]);
            return $lockedBooking;
        });

        return response()->json([
            'message' => 'Payout settled successfully.',
            'data' => $booking->load(['servicePackage.category', 'worker:id,name', 'customer:id,name']),
        ]);
    }
}