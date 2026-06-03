<?php

namespace Tests\Feature\Api;

use App\Models\Booking;
use App\Models\ServiceCategory;
use App\Models\ServicePackage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MarketplaceTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_list_categories_and_services(): void
    {
        $category = ServiceCategory::create([
            'name' => 'Painting',
            'slug' => 'painting',
            'description' => 'Painting services',
            'is_active' => true,
        ]);

        $worker = User::factory()->create([
            'role' => 'worker',
            'phone' => '94771234567',
            'phone_verified_at' => now(),
        ]);

        ServicePackage::create([
            'user_id' => $worker->id,
            'service_category_id' => $category->id,
            'title' => 'Interior Painting',
            'slug' => 'interior-painting',
            'description' => 'Interior walls painting',
            'price' => 2500,
            'duration_minutes' => 180,
            'location_type' => 'onsite',
            'is_active' => true,
        ]);

        $this->getJson('/api/v1/categories')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Painting');

        $this->getJson('/api/v1/services?category=painting')
            ->assertOk()
            ->assertJsonPath('data.data.0.title', 'Interior Painting');
    }

    public function test_worker_can_create_service_package(): void
    {
        $category = ServiceCategory::create([
            'name' => 'Electrical',
            'slug' => 'electrical',
            'description' => 'Electrical services',
            'is_active' => true,
        ]);

        $worker = User::factory()->create([
            'role' => 'worker',
            'phone' => '94771234567',
            'phone_verified_at' => now(),
        ]);

        $token = $worker->issueApiToken();

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/worker/services', [
                'service_category_id' => $category->id,
                'title' => 'AC Wiring',
                'description' => 'Safe wiring and installation',
                'price' => 3200,
                'duration_minutes' => 90,
                'location_type' => 'onsite',
            ])
            ->assertCreated()
            ->assertJsonPath('data.title', 'AC Wiring');
    }

    public function test_customer_can_create_and_cancel_booking(): void
    {
        $category = ServiceCategory::create([
            'name' => 'Cleaning',
            'slug' => 'cleaning',
            'description' => 'Cleaning services',
            'is_active' => true,
        ]);

        $worker = User::factory()->create([
            'role' => 'worker',
            'phone' => '94771234567',
            'phone_verified_at' => now(),
            'status' => 'Active',
            'verification' => 'Verified',
        ]);

        $servicePackage = ServicePackage::create([
            'user_id' => $worker->id,
            'service_category_id' => $category->id,
            'title' => 'Deep Cleaning',
            'slug' => 'deep-cleaning',
            'description' => 'Full home cleaning',
            'price' => 4500,
            'duration_minutes' => 120,
            'location_type' => 'onsite',
            'is_active' => true,
        ]);

        $customer = User::factory()->create([
            'role' => 'customer',
            'phone' => '94777654321',
            'phone_verified_at' => now(),
        ]);

        $token = $customer->issueApiToken();

        $createResponse = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/bookings', [
                'service_package_id' => $servicePackage->id,
                'scheduled_at' => now()->addDay()->toIso8601String(),
                'address' => '123 Main Street, Colombo',
                'notes' => 'Please bring supplies',
            ]);

        $createResponse->assertCreated()
            ->assertJsonPath('data.status', 'pending');

        $bookingId = $createResponse->json('data.id');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->patchJson('/api/v1/auth/bookings/'.$bookingId.'/cancel')
            ->assertOk()
            ->assertJsonPath('data.status', 'cancelled');

        $this->assertDatabaseHas('bookings', [
            'id' => $bookingId,
            'status' => 'cancelled',
        ]);
    }

    public function test_worker_can_complete_booking_and_update_wallet(): void
    {
        $category = ServiceCategory::create([
            'name' => 'Gardening',
            'slug' => 'gardening',
            'description' => 'Gardening services',
            'is_active' => true,
        ]);

        $worker = User::factory()->create([
            'role' => 'worker',
            'phone' => '94771234568',
            'phone_verified_at' => now(),
        ]);

        $servicePackage = ServicePackage::create([
            'user_id' => $worker->id,
            'service_category_id' => $category->id,
            'title' => 'Lawn Mowing',
            'slug' => 'lawn-mowing',
            'description' => 'Professional lawn mowing',
            'price' => 1500,
            'duration_minutes' => 60,
            'location_type' => 'onsite',
            'is_active' => true,
        ]);

        $customer = User::factory()->create([
            'role' => 'customer',
            'phone' => '94777654322',
            'phone_verified_at' => now(),
        ]);

        $booking = Booking::create([
            'customer_id' => $customer->id,
            'worker_id' => $worker->id,
            'service_package_id' => $servicePackage->id,
            'scheduled_at' => now()->addDay(),
            'address' => '456 Garden St, Colombo',
            'total_price' => 1500,
            'status' => 'confirmed',
        ]);

        $token = $worker->issueApiToken();

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->patchJson('/api/v1/auth/bookings/'.$booking->id.'/complete')
            ->assertOk()
            ->assertJsonPath('data.status', 'completed');

        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'status' => 'completed',
        ]);

        $this->assertDatabaseHas('wallets', [
            'user_id' => $worker->id,
            'balance' => 1500.00,
        ]);
    }

    public function test_booking_calculates_advance_paid_securely_on_backend_and_records_payment(): void
    {
        $category = ServiceCategory::create([
            'name' => 'Cleaning',
            'slug' => 'cleaning',
            'description' => 'Cleaning services',
            'is_active' => true,
        ]);

        $worker = User::factory()->create([
            'role' => 'worker',
            'phone' => '94771234567',
            'phone_verified_at' => now(),
            'status' => 'Active',
            'verification' => 'Verified',
        ]);

        $servicePackage = ServicePackage::create([
            'user_id' => $worker->id,
            'service_category_id' => $category->id,
            'title' => 'Deep Cleaning',
            'slug' => 'deep-cleaning',
            'description' => 'Full home cleaning',
            'price' => 10000,
            'duration_minutes' => 120,
            'location_type' => 'onsite',
            'is_active' => true,
        ]);

        $customer = User::factory()->create([
            'role' => 'customer',
            'phone' => '94777654321',
            'phone_verified_at' => now(),
        ]);

        $token = $customer->issueApiToken();

        // Send booking request trying to override advance_paid to 1.00
        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/bookings', [
                'service_package_id' => $servicePackage->id,
                'scheduled_at' => now()->addDay()->toIso8601String(),
                'address' => '123 Main Street, Colombo',
                'payment_option' => 'advance',
                'advance_paid' => 1.00, // Attack/override attempt
            ]);

        $response->assertCreated();

        $bookingId = $response->json('data.id');

        // Verify advance_paid is calculated securely on backend: (10000 * 1.05) / 2 = 5250
        $this->assertDatabaseHas('bookings', [
            'id' => $bookingId,
            'advance_paid' => 5250.00,
            'payment_option' => 'advance',
        ]);

        // Verify payment record exists in the payments table
        $this->assertDatabaseHas('payments', [
            'booking_id' => $bookingId,
            'amount' => 5250.00,
            'status' => 'completed',
        ]);
    }

    public function test_admin_credentials_are_encrypted_in_database(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $token = $admin->issueApiToken();

        $credentials = [
            'smsSenderId' => 'SKILLEDLK',
            'smsApiKey' => 'secret_api_key_123',
            'smsApiSecret' => 'secret_api_secret_456',
            'paymentGatewayId' => 'stripe_123',
            'paymentGatewaySecret' => 'sk_live_789',
            'webhookSecret' => 'whsec_999',
        ];

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/admin/credentials', $credentials);

        $response->assertOk();

        // Fetch raw record from DB to verify it's encrypted (not stored as plain JSON)
        $rawSetting = \Illuminate\Support\Facades\DB::table('settings')
            ->where('key', 'credentials')
            ->first();

        $this->assertNotNull($rawSetting);
        // The value should not be the JSON representation because of encryption
        $this->assertNotEquals(json_encode($credentials), $rawSetting->value);

        // Fetch via Model to verify decryption works
        $retrieved = \App\Models\Setting::get('credentials');
        $this->assertEquals($credentials, $retrieved);
    }

    public function test_booking_status_machine_transitions_are_protected(): void
    {
        $category = ServiceCategory::create([
            'name' => 'Gardening',
            'slug' => 'gardening',
            'description' => 'Gardening services',
            'is_active' => true,
        ]);

        $worker = User::factory()->create([
            'role' => 'worker',
            'phone' => '94771234568',
            'phone_verified_at' => now(),
        ]);
        $customer = User::factory()->create([
            'role' => 'customer',
            'phone' => '94777654322',
            'phone_verified_at' => now(),
        ]);

        $servicePackage = ServicePackage::create([
            'user_id' => $worker->id,
            'service_category_id' => $category->id,
            'title' => 'Lawn Mowing',
            'slug' => 'lawn-mowing',
            'description' => 'Professional lawn mowing',
            'price' => 1500,
            'duration_minutes' => 60,
            'location_type' => 'onsite',
            'is_active' => true,
        ]);

        $booking = Booking::create([
            'customer_id' => $customer->id,
            'worker_id' => $worker->id,
            'service_package_id' => $servicePackage->id,
            'scheduled_at' => now()->addDay(),
            'address' => '456 Garden St, Colombo',
            'total_price' => 1500,
            'status' => 'pending',
        ]);

        $workerToken = $worker->issueApiToken();

        // 1. Try to complete a pending booking (should fail with 422)
        $this->withHeader('Authorization', 'Bearer '.$workerToken)
            ->patchJson('/api/v1/auth/bookings/'.$booking->id.'/complete')
            ->assertStatus(422);

        // 2. Try to settle a pending booking (should fail with 422)
        $this->withHeader('Authorization', 'Bearer '.$workerToken)
            ->patchJson('/api/v1/auth/bookings/'.$booking->id.'/settle')
            ->assertStatus(422);

        // 3. Accept booking (pending -> confirmed)
        $this->withHeader('Authorization', 'Bearer '.$workerToken)
            ->patchJson('/api/v1/auth/bookings/'.$booking->id.'/accept')
            ->assertOk();

        // 4. Try to accept a confirmed booking (should fail with 422)
        $this->withHeader('Authorization', 'Bearer '.$workerToken)
            ->patchJson('/api/v1/auth/bookings/'.$booking->id.'/accept')
            ->assertStatus(422);

        // 5. Complete booking (confirmed -> completed)
        $this->withHeader('Authorization', 'Bearer '.$workerToken)
            ->patchJson('/api/v1/auth/bookings/'.$booking->id.'/complete')
            ->assertOk();

        // 6. Try to cancel a completed booking (should fail with 422)
        $this->withHeader('Authorization', 'Bearer '.$workerToken)
            ->patchJson('/api/v1/auth/bookings/'.$booking->id.'/cancel')
            ->assertStatus(422);
    }

    public function test_cannot_repeatedly_complete_booking(): void
    {
        $category = ServiceCategory::create([
            'name' => 'Gardening',
            'slug' => 'gardening',
            'description' => 'Gardening services',
            'is_active' => true,
        ]);

        $worker = User::factory()->create([
            'role' => 'worker',
            'phone' => '94771234569',
            'phone_verified_at' => now(),
        ]);
        $customer = User::factory()->create([
            'role' => 'customer',
            'phone' => '94777654323',
            'phone_verified_at' => now(),
        ]);

        $servicePackage = ServicePackage::create([
            'user_id' => $worker->id,
            'service_category_id' => $category->id,
            'title' => 'Lawn Mowing',
            'slug' => 'lawn-mowing',
            'description' => 'Professional lawn mowing',
            'price' => 1500,
            'duration_minutes' => 60,
            'location_type' => 'onsite',
            'is_active' => true,
        ]);

        $booking = Booking::create([
            'customer_id' => $customer->id,
            'worker_id' => $worker->id,
            'service_package_id' => $servicePackage->id,
            'scheduled_at' => now()->addDay(),
            'address' => '456 Garden St, Colombo',
            'total_price' => 1500,
            'status' => 'confirmed',
        ]);

        $workerToken = $worker->issueApiToken();

        // Complete the booking first time (credits wallet balance by 1500)
        $this->withHeader('Authorization', 'Bearer '.$workerToken)
            ->patchJson('/api/v1/auth/bookings/'.$booking->id.'/complete')
            ->assertOk();

        $this->assertEquals(1500, $worker->fresh()->wallet->balance);

        // Attempt to complete a second time (should fail with 422)
        $this->withHeader('Authorization', 'Bearer '.$workerToken)
            ->patchJson('/api/v1/auth/bookings/'.$booking->id.'/complete')
            ->assertStatus(422);

        // Balance must remain exactly 1500
        $this->assertEquals(1500, $worker->fresh()->wallet->balance);
    }

    public function test_service_package_image_url_validation(): void
    {
        $category = ServiceCategory::create([
            'name' => 'Gardening',
            'slug' => 'gardening',
            'description' => 'Gardening services',
            'is_active' => true,
        ]);

        $worker = User::factory()->create([
            'role' => 'worker',
            'phone' => '94771234560',
            'phone_verified_at' => now(),
        ]);
        $token = $worker->issueApiToken();

        // 1. Invalid URL format
        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/worker/services', [
                'service_category_id' => $category->id,
                'title' => 'Lawn Mowing',
                'price' => 1500,
                'image_url' => 'not-a-url',
            ])
            ->assertStatus(422)
            ->assertJsonPath('message', 'Invalid image URL format.');

        // 2. Unapproved storage provider (host mismatch)
        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/worker/services', [
                'service_category_id' => $category->id,
                'title' => 'Lawn Mowing',
                'price' => 1500,
                'image_url' => 'https://malicious-site.com/storage/v1/object/public/service-images/test.png',
            ])
            ->assertStatus(422)
            ->assertJsonPath('message', 'Image must be hosted on the approved storage provider.');

        // 3. Disallowed extension
        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/worker/services', [
                'service_category_id' => $category->id,
                'title' => 'Lawn Mowing',
                'price' => 1500,
                'image_url' => 'https://ujxtjrmzptqyghzuyuyy.supabase.co/storage/v1/object/public/service-images/test.exe',
            ])
            ->assertStatus(422)
            ->assertJsonPath('message', 'Only JPG, JPEG, PNG, GIF, and WEBP images are allowed.');

        // 4. Image size exceeds 5MB
        \Illuminate\Support\Facades\Http::fake([
            'https://ujxtjrmzptqyghzuyuyy.supabase.co/*' => \Illuminate\Support\Facades\Http::response('', 200, [
                'Content-Length' => 6 * 1024 * 1024, // 6MB
            ]),
        ]);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/worker/services', [
                'service_category_id' => $category->id,
                'title' => 'Lawn Mowing',
                'price' => 1500,
                'image_url' => 'https://ujxtjrmzptqyghzuyuyy.supabase.co/storage/v1/object/public/service-images/test.png',
            ])
            ->assertStatus(422)
            ->assertJsonPath('message', 'The image size exceeds the 5MB limit.');
    }

    public function test_booking_creation_availability_and_status_checks(): void
    {
        $category = ServiceCategory::create([
            'name' => 'Gardening',
            'slug' => 'gardening',
            'description' => 'Gardening services',
            'is_active' => true,
        ]);

        $worker = User::factory()->create([
            'role' => 'worker',
            'phone' => '94771234560',
            'phone_verified_at' => now(),
            'status' => 'Active',
            'verification' => 'Verified',
        ]);

        $servicePackage = ServicePackage::create([
            'user_id' => $worker->id,
            'service_category_id' => $category->id,
            'title' => 'Lawn Mowing',
            'slug' => 'lawn-mowing',
            'description' => 'Professional lawn mowing',
            'price' => 1500,
            'duration_minutes' => 60,
            'location_type' => 'onsite',
            'is_active' => true,
        ]);

        $customer = User::factory()->create([
            'role' => 'customer',
            'phone' => '94777654321',
            'phone_verified_at' => now(),
        ]);

        $token = $customer->issueApiToken();
        $scheduledAt = now()->addDay()->format('Y-m-d H:i:s');

        // 1. Booking inactive package should fail
        $servicePackage->update(['is_active' => false]);
        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/bookings', [
                'service_package_id' => $servicePackage->id,
                'scheduled_at' => $scheduledAt,
                'address' => 'Colombo',
            ])
            ->assertStatus(422)
            ->assertJsonPath('message', 'This service package is no longer active.');
        $servicePackage->update(['is_active' => true]);

        // 2. Booking suspended worker should fail
        $worker->forceFill(['status' => 'Suspended'])->save();
        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/bookings', [
                'service_package_id' => $servicePackage->id,
                'scheduled_at' => $scheduledAt,
                'address' => 'Colombo',
            ])
            ->assertStatus(422)
            ->assertJsonPath('message', 'The service provider is currently unavailable.');
        $worker->forceFill(['status' => 'Active'])->save();

        // 3. Booking unverified worker should fail
        $worker->forceFill(['verification' => 'Pending verification'])->save();
        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/bookings', [
                'service_package_id' => $servicePackage->id,
                'scheduled_at' => $scheduledAt,
                'address' => 'Colombo',
            ])
            ->assertStatus(422)
            ->assertJsonPath('message', 'The service provider is not verified.');
        $worker->forceFill(['verification' => 'Verified'])->save();

        // 4. Booking successfully first time
        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/bookings', [
                'service_package_id' => $servicePackage->id,
                'scheduled_at' => $scheduledAt,
                'address' => 'Colombo',
            ])
            ->assertCreated();

        // 5. Booking same worker at same slot again should fail (double booking conflict)
        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/bookings', [
                'service_package_id' => $servicePackage->id,
                'scheduled_at' => $scheduledAt,
                'address' => 'Colombo',
            ])
            ->assertStatus(422)
            ->assertJsonPath('message', 'The service provider is already booked for this time slot.');
    }

    public function test_cache_is_invalidated_when_service_package_created_or_updated(): void
    {
        $category = ServiceCategory::create([
            'name' => 'Gardening',
            'slug' => 'gardening',
            'description' => 'Gardening services',
            'is_active' => true,
        ]);

        $worker = User::factory()->create([
            'role' => 'worker',
            'phone' => '94771234560',
            'phone_verified_at' => now(),
            'status' => 'Active',
            'verification' => 'Verified',
        ]);
        $token = $worker->issueApiToken();

        // 1. Send requests to populate cache
        $this->getJson('/api/v1/categories');
        $this->getJson('/api/v1/services');

        $this->assertTrue(\Illuminate\Support\Facades\Cache::has('categories:active'));
        $this->assertTrue(\Illuminate\Support\Facades\Cache::has('services:list:version'));
        $oldVersion = \Illuminate\Support\Facades\Cache::get('services:list:version');

        // 2. Create service package (should invalidate categories cache and increment services list version)
        $createResponse = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/worker/services', [
                'service_category_id' => $category->id,
                'title' => 'Lawn Mowing',
                'price' => 1500,
                'duration_minutes' => 60,
                'location_type' => 'onsite',
            ]);
        $createResponse->assertCreated();

        $this->assertFalse(\Illuminate\Support\Facades\Cache::has('categories:active'));
        $newVersion = \Illuminate\Support\Facades\Cache::get('services:list:version');
        $this->assertNotEquals($oldVersion, $newVersion);

        // Repopulate categories and services list cache
        $this->getJson('/api/v1/categories');
        $this->assertTrue(\Illuminate\Support\Facades\Cache::has('categories:active'));
        $oldVersion = $newVersion;

        // 3. Update service package (should invalidate categories cache and increment services list version)
        $servicePackageId = $createResponse->json('data.id');
        $this->withHeader('Authorization', 'Bearer '.$token)
            ->patchJson('/api/v1/auth/worker/services/'.$servicePackageId, [
                'price' => 1800,
            ])->assertOk();

        $this->assertFalse(\Illuminate\Support\Facades\Cache::has('categories:active'));
        $newVersion = \Illuminate\Support\Facades\Cache::get('services:list:version');
        $this->assertNotEquals($oldVersion, $newVersion);
    }

    public function test_cache_is_invalidated_when_review_is_created(): void
    {
        $category = ServiceCategory::create([
            'name' => 'Gardening',
            'slug' => 'gardening',
            'description' => 'Gardening services',
            'is_active' => true,
        ]);

        $worker = User::factory()->create([
            'role' => 'worker',
            'phone' => '94771234560',
            'phone_verified_at' => now(),
            'status' => 'Active',
            'verification' => 'Verified',
        ]);

        $servicePackage = ServicePackage::create([
            'user_id' => $worker->id,
            'service_category_id' => $category->id,
            'title' => 'Lawn Mowing',
            'slug' => 'lawn-mowing',
            'description' => 'Professional lawn mowing',
            'price' => 1500,
            'duration_minutes' => 60,
            'location_type' => 'onsite',
            'is_active' => true,
        ]);

        $customer = User::factory()->create([
            'role' => 'customer',
            'phone' => '94777654321',
            'phone_verified_at' => now(),
        ]);

        $booking = Booking::create([
            'customer_id' => $customer->id,
            'worker_id' => $worker->id,
            'service_package_id' => $servicePackage->id,
            'scheduled_at' => now(),
            'address' => 'Colombo',
            'total_price' => 1500,
            'status' => 'completed',
        ]);

        $token = $customer->issueApiToken();

        // Populate cache
        $this->getJson('/api/v1/categories');
        $this->getJson('/api/v1/services');
        
        $this->assertTrue(\Illuminate\Support\Facades\Cache::has('categories:active'));
        $oldVersion = \Illuminate\Support\Facades\Cache::get('services:list:version');

        // Create review (should invalidate cache)
        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson("/api/v1/auth/bookings/{$booking->id}/reviews", [
                'rating' => 5,
                'comment' => 'Excellent service!',
            ])->assertCreated();

        $this->assertFalse(\Illuminate\Support\Facades\Cache::has('categories:active'));
        $newVersion = \Illuminate\Support\Facades\Cache::get('services:list:version');
        $this->assertNotEquals($oldVersion, $newVersion);
    }

    public function test_stats_calculation_returns_real_values(): void
    {
        $worker = User::factory()->create(['role' => 'worker', 'profile_views' => 42]);
        $customer = User::factory()->create(['role' => 'customer']);

        $category = ServiceCategory::create([
            'name' => 'Painting',
            'slug' => 'painting',
            'is_active' => true,
        ]);

        $servicePackage = ServicePackage::create([
            'user_id' => $worker->id,
            'service_category_id' => $category->id,
            'title' => 'Test Service',
            'slug' => 'test-service',
            'price' => 1000,
            'is_active' => true,
        ]);

        $booking = Booking::create([
            'customer_id' => $customer->id,
            'worker_id' => $worker->id,
            'service_package_id' => $servicePackage->id,
            'scheduled_at' => now()->addDay(),
            'address' => 'Test Address',
            'total_price' => 1000,
            'status' => 'completed',
        ]);

        // Add a review
        \App\Models\Review::create([
            'booking_id' => $booking->id,
            'customer_id' => $customer->id,
            'worker_id' => $worker->id,
            'rating' => 5,
            'comment' => 'Great service!',
        ]);

        // Add booking messages
        \App\Models\BookingMessage::create([
            'booking_id' => $booking->id,
            'sender_id' => $customer->id,
            'body' => 'Hello',
        ]);

        \App\Models\BookingMessage::create([
            'booking_id' => $booking->id,
            'sender_id' => $worker->id,
            'body' => 'Hi customer',
        ]);

        $customerToken = $customer->issueApiToken();
        $workerToken = $worker->issueApiToken();

        // Query customer stats
        $this->withHeader('Authorization', 'Bearer '.$customerToken)
            ->getJson('/api/v1/auth/customer/stats')
            ->assertOk()
            ->assertJsonPath('data.total_bookings', 1)
            ->assertJsonPath('data.completed_bookings', 1)
            ->assertJsonPath('data.reviews_given', 1)
            ->assertJsonPath('data.messages', 2); // Two messages in their bookings

        // Query worker stats
        $this->withHeader('Authorization', 'Bearer '.$workerToken)
            ->getJson('/api/v1/auth/worker/stats')
            ->assertOk()
            ->assertJsonPath('data.profile_views', 42);
    }

    public function test_worker_profile_views_increment(): void
    {
        $worker = User::factory()->create(['role' => 'worker', 'profile_views' => 0]);

        $category = ServiceCategory::create([
            'name' => 'Painting',
            'slug' => 'painting',
            'is_active' => true,
        ]);

        $servicePackage = ServicePackage::create([
            'user_id' => $worker->id,
            'service_category_id' => $category->id,
            'title' => 'Test Service',
            'slug' => 'test-service',
            'price' => 1000,
            'is_active' => true,
        ]);

        // 1. Visit worker's public profile (services filtered by worker_id)
        $this->getJson("/api/v1/services?worker_id={$worker->id}")->assertOk();
        $this->assertEquals(1, $worker->fresh()->profile_views);

        // 2. View specific service package details
        $this->getJson("/api/v1/services/{$servicePackage->id}")->assertOk();
        $this->assertEquals(2, $worker->fresh()->profile_views);
    }

    public function test_admin_can_send_announcements_to_audience(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $worker = User::factory()->create(['role' => 'worker']);
        $customer = User::factory()->create(['role' => 'customer']);

        $token = $admin->issueApiToken();

        // Dispatch broadcast to workers
        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/admin/notifications/send', [
                'channel' => 'email',
                'audience' => 'workers',
                'subject' => 'Attention Workers',
                'message' => 'This is an important broadcast for workers.',
            ])
            ->assertOk()
            ->assertJsonPath('message', 'EMAIL notification dispatched to workers.');

        // Assert Notification table has record for worker but not customer
        $this->assertDatabaseHas('notifications', [
            'user_id' => $worker->id,
            'title' => 'Attention Workers',
            'message' => 'This is an important broadcast for workers.',
            'type' => 'system',
        ]);

        $this->assertDatabaseMissing('notifications', [
            'user_id' => $customer->id,
            'title' => 'Attention Workers',
        ]);
    }
}
