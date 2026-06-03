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
        $response = $this->postJson('/api/v1/auth/register', [
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
        $response = $this->postJson('/api/v1/auth/register-worker', [
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

        $loginResponse = $this->postJson('/api/v1/auth/login', [
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
            ->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('data.user.email', $user->email);
    }

    public function test_user_can_request_and_verify_phone_login(): void
    {
        $requestResponse = $this->postJson('/api/v1/auth/phone/request-otp', [
            'name' => 'Phone User',
            'phone' => '+94 77 123 4567',
            'role' => 'customer',
        ]);

        $requestResponse->assertOk()
            ->assertJsonPath('data.phone', '94771234567')
            ->assertJsonPath('data.otp', '123456');

        $verifyResponse = $this->postJson('/api/v1/auth/phone/verify-otp', [
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
            ->postJson('/api/v1/auth/logout')
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

        $signupResponse = $this->postJson('/api/v1/auth/google', [
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

        $signinResponse = $this->postJson('/api/v1/auth/google', [
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
            ->postJson('/api/v1/auth/profile', [
                'name' => 'Updated Name',
            ]);

        $response->assertOk()
            ->assertJsonPath('data.user.name', 'Updated Name')
            ->assertJsonPath('data.user.phone', '94771111111');
        $this->assertNotNull($user->fresh()->phone_verified_at);

        // 2. Update phone (resets verification)
        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/profile', [
                'phone' => '+94 77 222 2222',
            ]);

        $response->assertOk()
            ->assertJsonPath('data.user.phone', '94772222222');
        $this->assertNull($user->fresh()->phone_verified_at);
    }

    public function test_admin_can_login_with_correct_credentials(): void
    {
        // Seed the admin using AdminSeeder
        $this->seed(\Database\Seeders\AdminSeeder::class);

        // Login as admin
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => env('ADMIN_EMAIL'),
            'password' => env('ADMIN_PASSWORD'),
        ]);

        $response->assertOk()
            ->assertJsonPath('data.user.email', env('ADMIN_EMAIL'))
            ->assertJsonPath('data.user.role', 'admin')
            ->assertJsonStructure([
                'message',
                'data' => [
                    'user' => ['id', 'name', 'email', 'role'],
                    'token',
                ],
            ]);
    }

    public function test_admin_cannot_login_with_incorrect_credentials(): void
    {
        $this->seed(\Database\Seeders\AdminSeeder::class);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => env('ADMIN_EMAIL'),
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('message', 'Invalid email or password.');
    }

    public function test_phone_otp_security_and_lockout(): void
    {
        $this->withoutMiddleware(\Illuminate\Routing\Middleware\ThrottleRequests::class);

        // 1. Request OTP
        $this->postJson('/api/v1/auth/phone/request-otp', [
            'name' => 'Secure Phone User',
            'phone' => '+94 77 999 9999',
            'role' => 'customer',
        ])->assertOk();

        // Verify that the user was NOT created in the database yet
        $this->assertDatabaseMissing('users', [
            'phone' => '94779999999',
        ]);

        // 2. Submit wrong OTP 5 times to trigger lockout
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/v1/auth/phone/verify-otp', [
                'phone' => '+94 77 999 9999',
                'otp' => '000000', // wrong OTP
            ])->assertStatus(422)
              ->assertJsonPath('message', 'Invalid or expired OTP.');
        }

        // 3. 6th attempt should return a lockout error
        $this->postJson('/api/v1/auth/phone/verify-otp', [
            'phone' => '+94 77 999 9999',
            'otp' => '123456', // correct OTP, but locked
        ])->assertStatus(422)
          ->assertJsonPath('message', 'Too many failed attempts. Please request a new OTP.');
    }

    public function test_user_can_update_profile_billing_and_change_password(): void
    {
        $user = User::factory()->create([
            'password' => 'old_password_123',
        ]);
        $token = $user->issueApiToken();

        $addresses = [
            [
                'id' => 12345,
                'label' => 'Home',
                'address' => 'No. 12, Flower Road, Colombo',
                'note' => 'Leave at the gate',
                'default' => true,
            ]
        ];

        $paymentMethods = [
            [
                'id' => 67890,
                'type' => 'Visa',
                'number' => '•••• •••• •••• 4321',
                'expiry' => 'Expires 12/28',
                'default' => true,
            ]
        ];

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/profile', [
                'name' => 'Updated User Name',
                'addresses' => $addresses,
                'payment_methods' => $paymentMethods,
                'current_password' => 'old_password_123',
                'password' => 'new_secure_password_999',
                'password_confirmation' => 'new_secure_password_999',
            ]);

        $response->assertOk();

        $updated = $user->fresh();
        $this->assertEquals('Updated User Name', $updated->name);
        $this->assertEquals($addresses, $updated->addresses);
        $this->assertEquals($paymentMethods, $updated->payment_methods);
        $this->assertTrue(\Illuminate\Support\Facades\Hash::check('new_secure_password_999', $updated->password));
    }

    public function test_user_cannot_change_password_with_incorrect_current_password(): void
    {
        $user = User::factory()->create([
            'password' => 'correct_current_password',
        ]);
        $token = $user->issueApiToken();

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/profile', [
                'name' => 'Name',
                'current_password' => 'wrong_current_password',
                'password' => 'new_password_123',
                'password_confirmation' => 'new_password_123',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('message', 'The provided current password does not match our records.');
    }

    public function test_worker_can_update_worker_profile_fields(): void
    {
        $user = User::factory()->create([
            'role' => 'worker',
            'verification' => 'Verified',
        ]);
        $token = $user->issueApiToken();

        $category = \App\Models\ServiceCategory::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
            'description' => 'Test Description',
            'is_active' => true,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/profile', [
                'primary_service_category_id' => $category->id,
                'city' => 'Kandy',
                'bio' => 'Experienced professional.',
                'skills' => ['Skill A', 'Skill B'],
                'avatar_url' => 'https://example.com/avatar.jpg',
                'nic_front' => 'https://example.com/nic_front.jpg',
                'nic_back' => 'https://example.com/nic_back.jpg',
                'certificates' => ['https://example.com/cert.pdf'],
                'police_clearance' => 'https://example.com/police.pdf',
                'portfolio' => ['https://example.com/portfolio1.jpg'],
            ]);

        $response->assertOk();

        $updated = $user->fresh();
        $this->assertEquals($category->id, $updated->primary_service_category_id);
        $this->assertEquals('Kandy', $updated->city);
        $this->assertEquals('Experienced professional.', $updated->bio);
        $this->assertEquals(['Skill A', 'Skill B'], $updated->skills);
        $this->assertEquals('https://example.com/avatar.jpg', $updated->avatar_url);
        $this->assertEquals('https://example.com/nic_front.jpg', $updated->nic_front);
        $this->assertEquals('https://example.com/nic_back.jpg', $updated->nic_back);
        $this->assertEquals(['https://example.com/cert.pdf'], $updated->certificates);
        $this->assertEquals('https://example.com/police.pdf', $updated->police_clearance);
        $this->assertEquals(['https://example.com/portfolio1.jpg'], $updated->portfolio);
        // Nic upload resets status to Pending verification
        $this->assertEquals('Pending verification', $updated->verification);
    }

    public function test_admin_workers_list_reflects_correct_city_and_category_fallback(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $adminToken = $admin->issueApiToken();

        $category = \App\Models\ServiceCategory::create([
            'name' => 'Gardening',
            'slug' => 'gardening',
            'is_active' => true,
        ]);

        // Worker 1: has primary category and specific city
        $worker1 = User::factory()->create([
            'role' => 'worker',
            'primary_service_category_id' => $category->id,
            'city' => 'Galle',
        ]);

        // Worker 2: has no category, but has a service package under a category, and null city
        $worker2 = User::factory()->create([
            'role' => 'worker',
            'primary_service_category_id' => null,
            'city' => null,
        ]);

        \App\Models\ServicePackage::create([
            'user_id' => $worker2->id,
            'service_category_id' => $category->id,
            'title' => 'Gardening Basic',
            'slug' => 'gardening-basic',
            'price' => 500.00,
            'is_active' => true,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer '.$adminToken)
            ->getJson('/api/v1/admin/workers');

        $response->assertOk();

        // Worker 1 assertions
        $response->assertJsonFragment([
            'id' => $worker1->id,
            'city' => 'Galle',
            'category' => 'Gardening',
        ]);

        // Worker 2 assertions (falls back to Colombo city, falls back to first package category Gardening)
        $response->assertJsonFragment([
            'id' => $worker2->id,
            'city' => 'Colombo',
            'category' => 'Gardening',
        ]);
    }

    public function test_user_can_login_without_v1_prefix(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'message',
                'data' => [
                    'user' => ['id', 'name', 'email'],
                    'token',
                ],
            ]);
    }

    public function test_user_can_register_without_v1_prefix(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Prefixless User',
            'email' => 'prefixless@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.user.email', 'prefixless@example.com');
    }

    public function test_api_not_found_returns_friendly_json(): void
    {
        $response = $this->getJson('/api/auth/invalid-endpoint-path');

        $response->assertStatus(404)
            ->assertJson([
                'message' => 'The requested API endpoint could not be found. Please check your URL and API version prefix (e.g. /api/v1/...).',
                'error' => 'Route Not Found',
            ]);
    }
}
