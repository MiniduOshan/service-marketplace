<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Booking;
use App\Models\Review;
use App\Models\BookingMessage;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
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

        $user->load(['category', 'pricingPlan']);

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

        $user->load(['category', 'pricingPlan']);

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
        $user->load(['category', 'pricingPlan']);

        return response()->json([
            'message' => 'Logged in with Google successfully.',
            'data' => [
                'user' => $user,
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

        $otp = $this->generatePhoneOtp();
        $otpExpiresAt = now()->addMinutes(10);

        $cacheData = [
            'name' => $validated['name'],
            'role' => $validated['role'],
            'otp_hash' => Hash::make($otp),
            'expires_at' => $otpExpiresAt->toIso8601String(),
            'attempts' => 0,
        ];

        Cache::put("phone_otp:{$phone}", $cacheData, $otpExpiresAt);

        $this->sendSMSOtp($phone, $otp);

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

        $cacheData = Cache::get("phone_otp:{$phone}");

        if (! $cacheData || now()->parse($cacheData['expires_at'])->isPast()) {
            return response()->json([
                'message' => 'Invalid or expired OTP.',
            ], 422);
        }

        if ($cacheData['attempts'] >= 5) {
            return response()->json([
                'message' => 'Too many failed attempts. Please request a new OTP.',
            ], 422);
        }

        if (! Hash::check($validated['otp'], $cacheData['otp_hash'])) {
            $cacheData['attempts']++;
            $expiry = now()->parse($cacheData['expires_at']);
            Cache::put("phone_otp:{$phone}", $cacheData, $expiry);

            return response()->json([
                'message' => 'Invalid or expired OTP.',
            ], 422);
        }

        // OTP verified successfully, remove cache entry
        Cache::forget("phone_otp:{$phone}");

        $user = User::where('phone', $phone)->first();

        if (! $user) {
            $user = User::create([
                'name' => $cacheData['name'],
                'email' => $this->buildPhoneEmail($phone, $cacheData['role']),
                'phone' => $phone,
                'password' => Str::random(40),
                'role' => $cacheData['role'],
                'phone_verified_at' => now(),
            ]);
        } else {
            $user->markPhoneVerified();
        }

        $token = $user->issueApiToken();
        $user->load(['category', 'pricingPlan']);

        return response()->json([
            'message' => 'Phone number verified successfully.',
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
        ]);
    }

    public function requestUserPhoneOtp(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'phone' => ['nullable', 'string', 'max:30'],
        ]);

        $phone = $validated['phone'] ?? $user->phone;
        $phone = User::normalizePhone($phone);

        if (! $phone) {
            return response()->json([
                'message' => 'Enter a valid phone number.',
            ], 422);
        }

        $otp = $this->generatePhoneOtp();
        $otpExpiresAt = now()->addMinutes(10);

        $cacheData = [
            'phone' => $phone,
            'otp_hash' => Hash::make($otp),
            'expires_at' => $otpExpiresAt->toIso8601String(),
            'attempts' => 0,
        ];

        Cache::put("user_phone_otp:{$user->id}", $cacheData, $otpExpiresAt);

        $this->sendSMSOtp($phone, $otp);

        return response()->json([
            'message' => 'OTP sent successfully.',
            'data' => [
                'phone' => $phone,
                'otp' => app()->isProduction() ? null : $otp,
            ],
        ]);
    }

    public function verifyUserPhoneOtp(Request $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validate([
            'otp' => ['required', 'string', 'size:6'],
        ]);

        $cacheData = Cache::get("user_phone_otp:{$user->id}");

        if (! $cacheData || now()->parse($cacheData['expires_at'])->isPast()) {
            return response()->json([
                'message' => 'Invalid or expired OTP.',
            ], 422);
        }

        if ($cacheData['attempts'] >= 5) {
            return response()->json([
                'message' => 'Too many failed attempts. Please request a new OTP.',
            ], 422);
        }

        if (! Hash::check($validated['otp'], $cacheData['otp_hash'])) {
            $cacheData['attempts']++;
            $expiry = now()->parse($cacheData['expires_at']);
            Cache::put("user_phone_otp:{$user->id}", $cacheData, $expiry);

            return response()->json([
                'message' => 'Invalid or expired OTP.',
            ], 422);
        }

        // OTP verified successfully, remove cache entry
        Cache::forget("user_phone_otp:{$user->id}");

        // Update user phone if it changed during verification
        if ($user->phone !== $cacheData['phone']) {
            $user->update(['phone' => $cacheData['phone']]);
        }
        
        $user->markPhoneVerified();
        $user->load(['category', 'pricingPlan']);

        return response()->json([
            'message' => 'Phone number verified successfully.',
            'data' => [
                'user' => $user,
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user) {
            $user->load(['category', 'pricingPlan']);
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
            'current_password' => ['nullable', 'string', 'required_with:password'],
            'password' => ['nullable', 'string', 'confirmed', \Illuminate\Validation\Rules\Password::min(8)],
            'addresses' => ['nullable', 'array'],
            'payment_methods' => ['nullable', 'array'],
            'primary_service_category_id' => ['nullable', 'exists:service_categories,id'],
            'city' => ['nullable', 'string', 'max:255'],
            'district' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:5000'],
            'skills' => ['nullable', 'array'],
            'avatar_url' => ['nullable', 'string'],
            'cover_photo' => ['nullable', 'string'],
            'nic_front' => ['nullable', 'string'],
            'nic_back' => ['nullable', 'string'],
            'certificates' => ['nullable', 'array'],
            'police_clearance' => ['nullable', 'string'],
            'portfolio' => ['nullable', 'array'],
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

        if ($request->has('password') && $validated['password']) {
            if (! Hash::check($validated['current_password'], $user->password)) {
                return response()->json([
                    'message' => 'The provided current password does not match our records.',
                ], 422);
            }
            $updates['password'] = Hash::make($validated['password']);
        }

        if ($request->has('addresses')) {
            $updates['addresses'] = $validated['addresses'];
        }

        if ($request->has('payment_methods')) {
            $updates['payment_methods'] = $validated['payment_methods'];
        }

        if ($request->has('primary_service_category_id')) {
            $updates['primary_service_category_id'] = $validated['primary_service_category_id'];
        }

        if ($request->has('city')) {
            $updates['city'] = $validated['city'];
        }

        if ($request->has('district')) {
            $updates['district'] = $validated['district'];
        }

        if ($request->has('bio')) {
            $updates['bio'] = $validated['bio'];
        }

        if ($request->has('skills')) {
            $updates['skills'] = $validated['skills'];
        }

        if ($request->has('avatar_url')) {
            $updates['avatar_url'] = $validated['avatar_url'];
        }

        if ($request->has('cover_photo')) {
            $updates['cover_photo'] = $validated['cover_photo'];
        }

        if ($request->has('nic_front')) {
            $updates['nic_front'] = $validated['nic_front'];
            $updates['verification'] = 'Pending verification';
        }

        if ($request->has('nic_back')) {
            $updates['nic_back'] = $validated['nic_back'];
            $updates['verification'] = 'Pending verification';
        }

        if ($request->has('certificates')) {
            $updates['certificates'] = $validated['certificates'];
        }

        if ($request->has('police_clearance')) {
            $updates['police_clearance'] = $validated['police_clearance'];
        }

        if ($request->has('portfolio')) {
            $updates['portfolio'] = $validated['portfolio'];
        }

        if (! empty($updates)) {
            $user->forceFill($updates)->save();
        }

        return response()->json([
            'message' => 'Profile updated successfully.',
            'data' => [
                'user' => $user->fresh()->load(['category', 'pricingPlan']),
            ],
        ]);
    }

    public function updatePricingPlan(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pricing_plan_id' => ['nullable', 'exists:pricing_plans,id'],
        ]);

        $user = $request->user();
        $user->update([
            'pricing_plan_id' => $validated['pricing_plan_id'],
        ]);

        return response()->json([
            'message' => 'Pricing plan updated successfully.',
            'data' => [
                'user' => $user->fresh()->load('pricingPlan'),
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
        
        $totalEarnings = Booking::where('worker_id', $user->id)
            ->where('status', 'completed')
            ->sum('total_price');
            
        $jobsDone = Booking::where('worker_id', $user->id)
            ->where('status', 'completed')
            ->count();
        
        $totalBookings = Booking::where('worker_id', $user->id)
            ->where('status', '!=', 'cancelled')
            ->count();

        return response()->json([
            'data' => [
                'total_earnings' => (double) $totalEarnings,
                'jobs_done' => (int) $jobsDone,
                'total_bookings' => (int) $totalBookings,
                'profile_views' => (int) ($user->profile_views ?? 0),
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

        $reviewsGiven = Review::where('customer_id', $user->id)->count();
        $messagesCount = BookingMessage::whereHas('booking', fn($q) => $q->where('customer_id', $user->id))->count();

        return response()->json([
            'data' => [
                'total_bookings' => (int) $totalBookings,
                'completed_bookings' => (int) $completedBookings,
                'reviews_given' => (int) $reviewsGiven,
                'messages' => (int) $messagesCount,
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

    private function sendSMSOtp(string $phone, string $otp): void
    {
        $credentials = \App\Models\Setting::get('credentials');
        $apiKey = $credentials['smsApiKey'] ?? env('SMS_API_KEY');
        $apiSecret = $credentials['smsApiSecret'] ?? env('SMS_API_SECRET');
        $senderId = $credentials['smsSenderId'] ?? env('SMS_SENDER_ID', 'SKILLEDLK');

        if ($apiKey && $apiSecret) {
            // Placeholder: integrate real SMS gateway service client (e.g. NotifyLK, Twilio, SMSGate) here.
            // Log OTP delivery status details for verification and audits.
            Log::info("SMS Gateway integration: OTP sent to {$phone}: {$otp} using Sender ID {$senderId}");
        } else {
            Log::debug("SMS Gateway simulation: OTP sent to {$phone}: {$otp}");
        }
    }
}