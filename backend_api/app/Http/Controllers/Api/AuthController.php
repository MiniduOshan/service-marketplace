<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
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
            'phone' => ['nullable', 'string', 'max:30', 'unique:users,phone'],
            'password' => ['required', 'string', 'confirmed', Password::min(8)],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => User::normalizePhone($validated['phone'] ?? null),
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

    public function google(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'credential' => ['required', 'string'],
            'flow' => ['required', 'in:signin,signup'],
            'role' => ['nullable', 'in:customer,worker'],
        ]);

        $googleProfile = $this->resolveGoogleProfile($validated['credential']);
        $normalizedEmail = strtolower($googleProfile['email']);

        $user = User::query()
            ->where('google_id', $googleProfile['sub'])
            ->orWhere('email', $normalizedEmail)
            ->first();

        if (! $user) {
            if ($validated['flow'] === 'signin') {
                return response()->json([
                    'message' => 'No account found for this Google account. Please sign up first.',
                ], 404);
            }

            $user = User::create([
                'name' => $googleProfile['name'] ?: $this->fallbackGoogleName($normalizedEmail),
                'email' => $normalizedEmail,
                'google_id' => $googleProfile['sub'],
                'password' => Str::random(40),
                'role' => $validated['role'] ?? 'customer',
                'email_verified_at' => $googleProfile['email_verified'] ? now() : null,
            ]);
        } else {
            $updates = [
                'google_id' => $user->google_id ?: $googleProfile['sub'],
                'email_verified_at' => $user->email_verified_at ?? ($googleProfile['email_verified'] ? now() : null),
            ];

            if (! $user->name && $googleProfile['name']) {
                $updates['name'] = $googleProfile['name'];
            }

            $user->forceFill(array_filter($updates, static fn ($value) => $value !== null))->save();
        }

        $token = $user->issueApiToken();

        return response()->json([
            'message' => 'Logged in with Google successfully.',
            'data' => [
                'user' => $user->fresh(),
                'token' => $token,
            ],
        ]);
    }

    public function requestPhoneOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone' => ['required', 'string', 'max:30'],
            'name' => ['required', 'string', 'max:255'],
            'role' => ['required', 'in:customer,worker'],
        ]);

        $phone = User::normalizePhone($validated['phone']);

        if (! $phone) {
            return response()->json([
                'message' => 'Enter a valid phone number.',
            ], 422);
        }

        $user = User::firstOrCreate(
            ['phone' => $phone],
            [
                'name' => $validated['name'],
                'email' => $this->buildPhoneEmail($phone, $validated['role']),
                'password' => Str::random(40),
                'role' => $validated['role'],
            ]
        );

        if ($user->name !== $validated['name']) {
            $user->forceFill(['name' => $validated['name']])->save();
        }

        $otp = $this->generatePhoneOtp();
        $user->storePhoneOtp($otp);

        return response()->json([
            'message' => 'OTP sent successfully.',
            'data' => [
                'phone' => $phone,
                'verification_target' => $phone,
                'otp' => app()->isProduction() ? null : $otp,
            ],
        ]);
    }

    public function verifyPhoneOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone' => ['required', 'string', 'max:30'],
            'otp' => ['required', 'string', 'size:6'],
        ]);

        $phone = User::normalizePhone($validated['phone']);

        if (! $phone) {
            return response()->json([
                'message' => 'Enter a valid phone number.',
            ], 422);
        }

        $user = User::where('phone', $phone)->first();

        if (! $user) {
            return response()->json([
                'message' => 'No account found for this phone number.',
            ], 404);
        }

        if (! $user->verifyPhoneOtp($validated['otp'])) {
            return response()->json([
                'message' => 'Invalid or expired OTP.',
            ], 422);
        }

        $user->markPhoneVerified();
        $token = $user->issueApiToken();

        return response()->json([
            'message' => 'Phone number verified successfully.',
            'data' => [
                'user' => $user->fresh(),
                'token' => $token,
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user) {
            $user->load('category');
        }
        return response()->json([
            'data' => [
                'user' => $user,
            ],
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30', 'unique:users,phone,' . $user->id],
        ]);

        $updates = [];
        if ($request->has('name')) {
            $updates['name'] = $validated['name'];
        }

        if ($request->has('phone')) {
            if ($validated['phone'] === null || trim($validated['phone']) === '') {
                $updates['phone'] = null;
                $updates['phone_verified_at'] = null;
                $updates['phone_otp_hash'] = null;
                $updates['phone_otp_expires_at'] = null;
            } else {
                $phone = User::normalizePhone($validated['phone']);

                if (! $phone) {
                    return response()->json([
                        'message' => 'Enter a valid phone number.',
                    ], 422);
                }

                if ($phone !== $user->phone) {
                    $updates['phone'] = $phone;
                    $updates['phone_verified_at'] = null;
                    $updates['phone_otp_hash'] = null;
                    $updates['phone_otp_expires_at'] = null;
                }
            }
        }

        if (! empty($updates)) {
            $user->forceFill($updates)->save();
        }

        return response()->json([
            'message' => 'Profile updated successfully.',
            'data' => [
                'user' => $user->fresh(),
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

    public function workerStats(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $completedBookings = Booking::where('worker_id', $user->id)
            ->where('status', 'completed')
            ->get();
            
        $totalEarnings = $completedBookings->sum('total_price');
        $jobsDone = $completedBookings->count();
        
        $totalBookings = Booking::where('worker_id', $user->id)
            ->where('status', '!=', 'cancelled')
            ->count();

        return response()->json([
            'data' => [
                'total_earnings' => (double) $totalEarnings,
                'jobs_done' => (int) $jobsDone,
                'total_bookings' => (int) $totalBookings,
                'profile_views' => 0,
            ],
        ]);
    }

    public function customerStats(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $totalBookings = Booking::where('customer_id', $user->id)->count();
        $completedBookings = Booking::where('customer_id', $user->id)
            ->where('status', 'completed')
            ->count();

        return response()->json([
            'data' => [
                'total_bookings' => (int) $totalBookings,
                'completed_bookings' => (int) $completedBookings,
                'reviews_given' => 0,
                'messages' => 0,
            ],
        ]);
    }

    private function generatePhoneOtp(): string
    {
        if (app()->environment('testing')) {
            return '123456';
        }

        return (string) random_int(100000, 999999);
    }

    private function buildPhoneEmail(string $phone, string $role): string
    {
        return sprintf('%s.%s@phone.skilledlk.local', $role, $phone);
    }

    private function resolveGoogleProfile(string $credential): array
    {
        $response = Http::timeout(10)->get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $credential,
        ]);

        if (! $response->successful()) {
            $this->googleError('Unable to verify the Google credential.');
        }

        $profile = $response->json();
        $clientIds = User::normalizeGoogleClientIds(config('services.google.client_ids', []));

        if ($clientIds === []) {
            $this->googleError('Google sign-in is not configured.', 500);
        }

        if (! in_array((string) ($profile['aud'] ?? ''), $clientIds, true)) {
            $this->googleError('Google credential was issued for an unexpected client.');
        }

        if (! filter_var($profile['email_verified'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
            $this->googleError('Google account email is not verified.');
        }

        return [
            'sub' => (string) ($profile['sub'] ?? ''),
            'email' => (string) ($profile['email'] ?? ''),
            'name' => (string) ($profile['name'] ?? ''),
            'email_verified' => true,
        ];
    }

    private function fallbackGoogleName(string $email): string
    {
        $localPart = trim(explode('@', $email)[0] ?? '');

        return $localPart !== '' ? str_replace(['.', '_', '-'], ' ', $localPart) : 'Google User';
    }

    private function googleError(string $message, int $status = 422): never
    {
        throw new HttpResponseException(response()->json([
            'message' => $message,
        ], $status));
    }
}