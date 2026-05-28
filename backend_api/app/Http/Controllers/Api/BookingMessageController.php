<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingMessageController extends Controller
{
    public function index(Request $request, Booking $booking): JsonResponse
    {
        $user = $request->user();

        abort_unless($user && ($user->id === $booking->customer_id || $user->id === $booking->worker_id), 403, 'You cannot access this conversation.');

        $messages = $booking->messages()
            ->with('sender:id,name,role')
            ->orderBy('created_at')
            ->get();

        return response()->json([
            'data' => $messages,
        ]);
    }

    public function store(Request $request, Booking $booking): JsonResponse
    {
        $user = $request->user();

        abort_unless($user && ($user->id === $booking->customer_id || $user->id === $booking->worker_id), 403, 'You cannot send messages in this conversation.');

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:1000'],
        ]);

        $message = BookingMessage::create([
            'booking_id' => $booking->id,
            'sender_id' => $user->id,
            'body' => strip_tags($validated['body']),
        ]);

        return response()->json([
            'message' => 'Message sent successfully.',
            'data' => $message->load('sender:id,name,role'),
        ], 201);
    }
}