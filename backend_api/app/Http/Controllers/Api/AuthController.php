<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        return $this->createAccount($request, 'customer', 'Account created successfully.');
    }

    public function registerWorker(Request $request): JsonResponse
    {
        return $this->createAccount($request, 'worker', 'Worker account created successfully.');
    }

    private function createAccount(Request $request, string $role, string $message): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'confirmed', Password::min(8)],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => $role,
        ]);

        $token = $user->issueApiToken();

        return response()->json([
            'message' => $message,
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password.',
            ], 422);
        }

        $token = $user->issueApiToken();

        return response()->json([
            'message' => 'Logged in successfully.',
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'data' => [
                'user' => $request->user(),
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->revokeApiToken();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}