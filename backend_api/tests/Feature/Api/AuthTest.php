<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_receive_token(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.user.email', 'test@example.com')
            ->assertJsonStructure([
                'message',
                'data' => [
                    'user' => ['id', 'name', 'email'],
                    'token',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
        ]);
    }

    public function test_worker_can_register_and_receive_token(): void
    {
        $response = $this->postJson('/api/auth/register-worker', [
            'name' => 'Worker User',
            'email' => 'worker@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.user.email', 'worker@example.com')
            ->assertJsonPath('data.user.role', 'worker')
            ->assertJsonStructure([
                'message',
                'data' => [
                    'user' => ['id', 'name', 'email', 'role'],
                    'token',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'worker@example.com',
            'role' => 'worker',
        ]);
    }

    public function test_user_can_login_and_access_profile(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123'),
        ]);

        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $loginResponse->assertOk()
            ->assertJsonStructure([
                'message',
                'data' => [
                    'user' => ['id', 'name', 'email'],
                    'token',
                ],
            ]);

        $token = $loginResponse->json('data.token');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('data.user.email', $user->email);
    }

    public function test_user_can_request_and_verify_phone_login(): void
    {
        $requestResponse = $this->postJson('/api/auth/phone/request-otp', [
            'name' => 'Phone User',
            'phone' => '+94 77 123 4567',
            'role' => 'customer',
        ]);

        $requestResponse->assertOk()
            ->assertJsonPath('data.phone', '94771234567')
            ->assertJsonPath('data.otp', '123456');

        $verifyResponse = $this->postJson('/api/auth/phone/verify-otp', [
            'phone' => '+94 77 123 4567',
            'otp' => '123456',
        ]);

        $verifyResponse->assertOk()
            ->assertJsonStructure([
                'message',
                'data' => [
                    'user' => ['id', 'name', 'email', 'phone', 'phone_verified_at'],
                    'token',
                ],
            ])
            ->assertJsonPath('data.user.phone', '94771234567');
    }

    public function test_user_can_logout(): void
    {
        $user = User::factory()->create();
        $token = $user->issueApiToken();

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/auth/logout')
            ->assertOk();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'api_token_hash' => null,
        ]);
    }

    public function test_user_can_sign_up_with_google_and_sign_in_again(): void
    {
        config([
            'services.google.client_ids' => ['web-client-id'],
        ]);

        Http::fake([
            'https://oauth2.googleapis.com/tokeninfo*' => Http::response([
                'aud' => 'web-client-id',
                'sub' => 'google-sub-123',
                'email' => 'google.user@example.com',
                'name' => 'Google User',
                'email_verified' => 'true',
            ], 200),
        ]);

        $signupResponse = $this->postJson('/api/auth/google', [
            'credential' => 'fake-google-token',
            'flow' => 'signup',
            'role' => 'worker',
        ]);

        $signupResponse->assertOk()
            ->assertJsonPath('data.user.email', 'google.user@example.com')
            ->assertJsonPath('data.user.role', 'worker');

        $this->assertDatabaseHas('users', [
            'email' => 'google.user@example.com',
            'google_id' => 'google-sub-123',
            'role' => 'worker',
        ]);

        $signinResponse = $this->postJson('/api/auth/google', [
            'credential' => 'fake-google-token',
            'flow' => 'signin',
        ]);

        $signinResponse->assertOk()
            ->assertJsonPath('data.user.email', 'google.user@example.com');
    }

    public function test_user_can_update_profile_details(): void
    {
        $user = User::factory()->create([
            'name' => 'Original Name',
            'phone' => '94771111111',
            'phone_verified_at' => now(),
        ]);
        $token = $user->issueApiToken();

        // 1. Update only name
        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/auth/profile', [
                'name' => 'Updated Name',
            ]);

        $response->assertOk()
            ->assertJsonPath('data.user.name', 'Updated Name')
            ->assertJsonPath('data.user.phone', '94771111111');
        $this->assertNotNull($user->fresh()->phone_verified_at);

        // 2. Update phone (resets verification)
        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/auth/profile', [
                'phone' => '+94 77 222 2222',
            ]);

        $response->assertOk()
            ->assertJsonPath('data.user.phone', '94772222222');
        $this->assertNull($user->fresh()->phone_verified_at);
    }
}