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
            ->with(['servicePackage.category', 'worker:id,name,phone', 'customer:id,name,phone'])
            ->where(function ($query) use ($user): void {
                $query->where('customer_id', $user->id)
                    ->orWhere('worker_id', $user->id);
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

        $validated = $request->validate([
            'service_package_id' => ['required', 'exists:service_packages,id'],
            'scheduled_at' => ['required', 'date', 'after:now'],
            'address' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        $servicePackage = ServicePackage::query()->whereKey($validated['service_package_id'])->firstOrFail();

        $booking = Booking::create([
            'customer_id' => $user->id,
            'worker_id' => $servicePackage->user_id,
            'service_package_id' => $servicePackage->id,
            'scheduled_at' => $validated['scheduled_at'],
            'address' => $validated['address'],
            'notes' => $validated['notes'] ?? null,
            'total_price' => $servicePackage->price,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Booking created successfully.',
            'data' => $booking->load(['servicePackage.category', 'worker:id,name', 'customer:id,name']),
        ], 201);
    }

    public function cancel(Request $request, Booking $booking): JsonResponse
    {
        $user = $request->user();

        abort_unless($user && ($user->id === $booking->customer_id || $user->id === $booking->worker_id), 403, 'You cannot cancel this booking.');

        $booking->update([
            'status' => 'cancelled',
        ]);

        return response()->json([
            'message' => 'Booking cancelled successfully.',
            'data' => $booking->fresh()->load(['servicePackage.category', 'worker:id,name', 'customer:id,name']),
        ]);
    }

    public function accept(Request $request, Booking $booking): JsonResponse
    {
        $user = $request->user();

        abort_unless($user && $user->id === $booking->worker_id, 403, 'Only the assigned worker can accept this booking.');

        $booking->update([
            'status' => 'confirmed',
        ]);

        return response()->json([
            'message' => 'Booking accepted successfully.',
            'data' => $booking->fresh()->load(['servicePackage.category', 'worker:id,name', 'customer:id,name']),
        ]);
    }

    public function complete(Request $request, Booking $booking): JsonResponse
    {
        $user = $request->user();

        abort_unless($user && $user->id === $booking->worker_id, 403, 'Only the assigned worker can mark this booking as completed.');

        DB::transaction(function () use ($booking): void {
            $booking->update([
                'status' => 'completed',
            ]);

            $worker = $booking->worker;
            $wallet = $worker->wallet()->firstOrCreate([], [
                'balance' => 0.00,
            ]);
            $wallet->increment('balance', $booking->total_price);
        });

        return response()->json([
            'message' => 'Booking completed successfully.',
            'data' => $booking->fresh()->load(['servicePackage.category', 'worker:id,name', 'customer:id,name']),
        ]);
    }
}