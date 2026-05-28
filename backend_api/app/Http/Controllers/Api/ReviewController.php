<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request, Booking $booking): JsonResponse
    {
        $user = $request->user();

        if ($booking->customer_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to review this booking.',
            ], 403);
        }

        if ($booking->status !== 'completed') {
            return response()->json([
                'message' => 'Cannot review a booking that is not completed.',
            ], 422);
        }

        $exists = Review::where('booking_id', $booking->id)->exists();
        if ($exists) {
            return response()->json([
                'message' => 'This booking has already been reviewed.',
            ], 422);
        }

        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        $review = Review::create([
            'booking_id' => $booking->id,
            'customer_id' => $user->id,
            'worker_id' => $booking->worker_id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        return response()->json([
            'message' => 'Review submitted successfully.',
            'data' => $review,
        ], 201);
    }

    public function index(Request $request, $workerId): JsonResponse
    {
        $reviews = Review::where('worker_id', $workerId)
            ->with('customer:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $reviews,
        ]);
    }
}
