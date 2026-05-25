<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\ServicePackage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $bookings = Booking::query()
            ->with(['servicePackage.category', 'worker:id,name', 'customer:id,name'])
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

        abort_unless($user?->isCustomer(), 403, 'Only customers can create bookings.');
        abort_unless($user->hasVerifiedPhone(), 403, 'Please verify your phone number before booking.');

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
}