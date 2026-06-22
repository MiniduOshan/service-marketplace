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

    public function test_worker_can_delete_their_own_service_package(): void
    {
        $category = ServiceCategory::create([
            'name' => 'Gardening',
            'slug' => 'gardening',
            'is_active' => true,
        ]);

        $worker = User::factory()->create(['role' => 'worker']);
        $token = $worker->issueApiToken();

        $servicePackage = ServicePackage::create([
            'user_id' => $worker->id,
            'service_category_id' => $category->id,
            'title' => 'Lawn Mowing',
            'slug' => 'lawn-mowing',
            'price' => 1500,
            'is_active' => true,
        ]);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->deleteJson('/api/v1/auth/worker/services/'.$servicePackage->id)
            ->assertOk()
            ->assertJsonPath('message', 'Service package deleted successfully.');

        $this->assertSoftDeleted('service_packages', [
            'id' => $servicePackage->id,
        ]);
    }

    public function test_worker_cannot_delete_other_workers_service_package(): void
    {
        $category = ServiceCategory::create([
            'name' => 'Gardening',
            'slug' => 'gardening',
            'is_active' => true,
        ]);

        $worker1 = User::factory()->create(['role' => 'worker']);
        $worker2 = User::factory()->create(['role' => 'worker']);
        $token = $worker1->issueApiToken();

        $servicePackage = ServicePackage::create([
            'user_id' => $worker2->id,
            'service_category_id' => $category->id,
            'title' => 'Lawn Mowing',
            'slug' => 'lawn-mowing',
            'price' => 1500,
            'is_active' => true,
        ]);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->deleteJson('/api/v1/auth/worker/services/'.$servicePackage->id)
            ->assertStatus(403);

        $this->assertDatabaseHas('service_packages', [
            'id' => $servicePackage->id,
            'deleted_at' => null,
        ]);
    }

    public function test_admin_can_manage_service_categories(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $worker = User::factory()->create(['role' => 'worker']);
        $adminToken = $admin->issueApiToken();
        $workerToken = $worker->issueApiToken();

        // 1. Create a category
        $createResponse = $this->withHeader('Authorization', 'Bearer '.$adminToken)
            ->postJson('/api/v1/admin/categories', [
                'name' => 'Carpentry',
                'description' => 'Wood working and repair services',
                'icon' => 'hammer',
                'is_active' => true,
            ]);

        $createResponse->assertCreated()
            ->assertJsonPath('data.name', 'Carpentry')
            ->assertJsonPath('data.slug', 'carpentry');

        $categoryId = $createResponse->json('data.id');

        $this->assertDatabaseHas('service_categories', [
            'id' => $categoryId,
            'name' => 'Carpentry',
        ]);

        // 2. Inactive category list is retrieved by Admin index
        // Let's create an inactive category
        $inactiveCategory = ServiceCategory::create([
            'name' => 'Inactive Category',
            'slug' => 'inactive-category',
            'is_active' => false,
        ]);

        $indexResponse = $this->withHeader('Authorization', 'Bearer '.$adminToken)
            ->getJson('/api/v1/admin/categories')
            ->assertOk();
        
        $this->assertCount(2, $indexResponse->json('data'));

        // Public index should only return active ones (so 1)
        $publicIndexResponse = $this->getJson('/api/v1/categories')
            ->assertOk();
        $this->assertCount(1, $publicIndexResponse->json('data'));

        // 3. Update category
        $updateResponse = $this->withHeader('Authorization', 'Bearer '.$adminToken)
            ->patchJson('/api/v1/admin/categories/'.$categoryId, [
                'name' => 'Advanced Carpentry',
                'is_active' => false,
            ]);

        $updateResponse->assertOk()
            ->assertJsonPath('data.name', 'Advanced Carpentry')
            ->assertJsonPath('data.is_active', false);

        // 4. Try to delete category that has service packages (should fail)
        ServicePackage::create([
            'user_id' => $worker->id,
            'service_category_id' => $categoryId,
            'title' => 'Table Repair',
            'slug' => 'table-repair',
            'price' => 1000,
            'is_active' => true,
        ]);

        $this->withHeader('Authorization', 'Bearer '.$adminToken)
            ->deleteJson('/api/v1/admin/categories/'.$categoryId)
            ->assertStatus(422)
            ->assertJsonPath('message', 'Cannot delete category that has service packages.');

        // Delete the package so we can delete the category
        ServicePackage::where('service_category_id', $categoryId)->forceDelete();

        // 5. Delete category successfully
        $this->withHeader('Authorization', 'Bearer '.$adminToken)
            ->deleteJson('/api/v1/admin/categories/'.$categoryId)
            ->assertOk()
            ->assertJsonPath('message', 'Category deleted successfully.');

        $this->assertDatabaseMissing('service_categories', [
            'id' => $categoryId,
        ]);

        // 6. Non-admin cannot manage categories
        $this->withHeader('Authorization', 'Bearer '.$workerToken)
            ->postJson('/api/v1/admin/categories', [
                'name' => 'Plumbing',
            ])
            ->assertStatus(403);
    }

    public function test_worker_visibility_follows_paid_or_active_status_rule(): void
    {
        $category = ServiceCategory::create([
            'name' => 'Gardening',
            'slug' => 'gardening',
            'is_active' => true,
        ]);

        // 1. Worker 1: Active, Verified, Free plan -> Should be visible
        $workerActive = User::factory()->create([
            'role' => 'worker',
            'status' => 'Active',
            'verification' => 'Verified',
        ]);
        ServicePackage::create([
            'user_id' => $workerActive->id,
            'service_category_id' => $category->id,
            'title' => 'Lawn Care Active',
            'slug' => 'lawn-care-active',
            'price' => 1500,
            'is_active' => true,
        ]);

        // 2. Worker 2: Suspended, Verified -> Should NOT be visible
        $workerSuspended = User::factory()->create([
            'role' => 'worker',
            'status' => 'Suspended',
            'verification' => 'Verified',
        ]);
        ServicePackage::create([
            'user_id' => $workerSuspended->id,
            'service_category_id' => $category->id,
            'title' => 'Lawn Care Suspended',
            'slug' => 'lawn-care-suspended',
            'price' => 1500,
            'is_active' => true,
        ]);

        // 3. Worker 3: Active, Rejected -> Should NOT be visible
        $workerRejected = User::factory()->create([
            'role' => 'worker',
            'status' => 'Active',
            'verification' => 'Rejected',
        ]);
        ServicePackage::create([
            'user_id' => $workerRejected->id,
            'service_category_id' => $category->id,
            'title' => 'Lawn Care Rejected',
            'slug' => 'lawn-care-rejected',
            'price' => 1500,
            'is_active' => true,
        ]);

        // 4. Worker 4: Active, Verified, on an INACTIVE pricing plan -> Should NOT be visible
        $inactivePlan = \App\Models\PricingPlan::create([
            'title' => 'Expired Plan',
            'slug' => 'expired-plan',
            'price' => 2000,
            'billing_cycle' => 'Monthly',
            'status' => 'Draft',
            'is_active' => false,
        ]);
        $workerInactivePlan = User::factory()->create([
            'role' => 'worker',
            'status' => 'Active',
            'verification' => 'Verified',
            'pricing_plan_id' => $inactivePlan->id,
        ]);
        ServicePackage::create([
            'user_id' => $workerInactivePlan->id,
            'service_category_id' => $category->id,
            'title' => 'Lawn Care Inactive Plan',
            'slug' => 'lawn-care-inactive-plan',
            'price' => 1500,
            'is_active' => true,
        ]);

        // Clean cache to run query fresh
        \Illuminate\Support\Facades\Cache::forever('services:list:version', (string) microtime(true));

        $response = $this->getJson('/api/v1/services?category=gardening')
            ->assertOk();

        $data = $response->json('data.data');

        // Assert only the active/paid (free plan is active) worker package is visible
        $this->assertCount(1, $data);
        $this->assertEquals('Lawn Care Active', $data[0]['title']);
    }

    public function test_worker_ranking_follows_configured_priority_rule(): void
    {
        $category = ServiceCategory::create([
            'name' => 'Plumbing',
            'slug' => 'plumbing',
            'is_active' => true,
        ]);

        $customer = User::factory()->create(['role' => 'customer']);

        // Create paid pricing plan
        $premiumPlan = \App\Models\PricingPlan::create([
            'title' => 'Premium Plan',
            'slug' => 'premium-plan',
            'price' => 5000,
            'billing_cycle' => 'Monthly',
            'status' => 'Active',
            'is_active' => true,
        ]);

        // 1. Worker A: Free plan, 5.0 rating, Verified, Active
        $workerA = User::factory()->create([
            'role' => 'worker',
            'status' => 'Active',
            'verification' => 'Verified',
        ]);
        $packageA = ServicePackage::create([
            'user_id' => $workerA->id,
            'service_category_id' => $category->id,
            'title' => 'Plumbing A',
            'slug' => 'plumbing-a',
            'price' => 1000,
            'is_active' => true,
        ]);
        $bookingA = Booking::create([
            'customer_id' => $customer->id,
            'worker_id' => $workerA->id,
            'service_package_id' => $packageA->id,
            'scheduled_at' => now(),
            'address' => '123 Main St, Colombo',
            'total_price' => 1000,
            'status' => 'completed',
        ]);
        \App\Models\Review::create([
            'booking_id' => $bookingA->id,
            'customer_id' => $customer->id,
            'worker_id' => $workerA->id,
            'rating' => 5,
        ]);

        // 2. Worker B: Premium plan (5000), 3.0 rating, Verified, Active
        $workerB = User::factory()->create([
            'role' => 'worker',
            'status' => 'Active',
            'verification' => 'Verified',
            'pricing_plan_id' => $premiumPlan->id,
        ]);
        $packageB = ServicePackage::create([
            'user_id' => $workerB->id,
            'service_category_id' => $category->id,
            'title' => 'Plumbing B',
            'slug' => 'plumbing-b',
            'price' => 1000,
            'is_active' => true,
        ]);
        $bookingB = Booking::create([
            'customer_id' => $customer->id,
            'worker_id' => $workerB->id,
            'service_package_id' => $packageB->id,
            'scheduled_at' => now(),
            'address' => '123 Main St, Colombo',
            'total_price' => 1000,
            'status' => 'completed',
        ]);
        \App\Models\Review::create([
            'booking_id' => $bookingB->id,
            'customer_id' => $customer->id,
            'worker_id' => $workerB->id,
            'rating' => 3,
        ]);

        // 3. Worker C: Free plan, 4.0 rating, Pending verification, Active
        $workerC = User::factory()->create([
            'role' => 'worker',
            'status' => 'Active',
            'verification' => 'Pending verification',
        ]);
        $packageC = ServicePackage::create([
            'user_id' => $workerC->id,
            'service_category_id' => $category->id,
            'title' => 'Plumbing C',
            'slug' => 'plumbing-c',
            'price' => 1000,
            'is_active' => true,
        ]);
        $bookingC = Booking::create([
            'customer_id' => $customer->id,
            'worker_id' => $workerC->id,
            'service_package_id' => $packageC->id,
            'scheduled_at' => now(),
            'address' => '123 Main St, Colombo',
            'total_price' => 1000,
            'status' => 'completed',
        ]);
        \App\Models\Review::create([
            'booking_id' => $bookingC->id,
            'customer_id' => $customer->id,
            'worker_id' => $workerC->id,
            'rating' => 4,
        ]);

        // Clean cache to run query fresh
        \Illuminate\Support\Facades\Cache::forever('services:list:version', (string) microtime(true));

        $response = $this->getJson('/api/v1/services?category=plumbing')
            ->assertOk();

        $data = $response->json('data.data');

        // Order priority:
        // 1. Premium Paid Plan (Worker B)
        // 2. High rating (Worker A: 5.0 vs Worker C: 4.0)
        // 3. Lower rating / verification fallback (Worker C)
        $this->assertCount(3, $data);
        $this->assertEquals('Plumbing B', $data[0]['title']); // Paid Plan first
        $this->assertEquals('Plumbing A', $data[1]['title']); // 5.0 Rating second
        $this->assertEquals('Plumbing C', $data[2]['title']); // 4.0 Rating third
    }

    public function test_contact_visibility_follows_platform_rule(): void
    {
        $category = ServiceCategory::create([
            'name' => 'Gardening',
            'slug' => 'gardening',
            'is_active' => true,
        ]);

        $worker = User::factory()->create([
            'role' => 'worker',
            'status' => 'Active',
            'verification' => 'Verified',
            'phone' => '94771234567',
        ]);

        $package = ServicePackage::create([
            'user_id' => $worker->id,
            'service_category_id' => $category->id,
            'title' => 'Lawn Mowing',
            'slug' => 'lawn-mowing',
            'price' => 1500,
            'is_active' => true,
        ]);

        $customer = User::factory()->create([
            'role' => 'customer',
            'phone' => '94777654321',
        ]);

        // 1. Check worker phone before booking (Public view should NOT show it)
        $responsePublic = $this->getJson('/api/v1/services/'.$package->id)
            ->assertOk();
        $this->assertArrayNotHasKey('phone', $responsePublic->json('data.worker'));

        // 2. Create pending booking (Should show "Masked")
        $customerToken = $customer->issueApiToken();
        $responseCreate = $this->withHeader('Authorization', 'Bearer '.$customerToken)
            ->postJson('/api/v1/auth/bookings', [
                'service_package_id' => $package->id,
                'scheduled_at' => now()->addDay()->toIso8601String(),
                'address' => '123 Main St, Colombo',
            ])
            ->assertCreated();

        $bookingId = $responseCreate->json('data.id');
        $this->assertEquals('Masked', $responseCreate->json('data.worker.phone'));

        // Check index as customer
        $responseIndex = $this->withHeader('Authorization', 'Bearer '.$customerToken)
            ->getJson('/api/v1/auth/bookings')
            ->assertOk();
        $this->assertEquals('Masked', $responseIndex->json('data.data.0.worker.phone'));
        $this->assertEquals('Masked', $responseIndex->json('data.data.0.customer.phone'));

        // 3. Confirm/Accept booking (Should reveal the phone numbers)
        $workerToken = $worker->issueApiToken();
        $this->withHeader('Authorization', 'Bearer '.$workerToken)
            ->patchJson('/api/v1/auth/bookings/'.$bookingId.'/accept')
            ->assertOk();

        $responseIndex2 = $this->withHeader('Authorization', 'Bearer '.$customerToken)
            ->getJson('/api/v1/auth/bookings')
            ->assertOk();

        $this->assertEquals('94771234567', $responseIndex2->json('data.data.0.worker.phone'));
        $this->assertEquals('94777654321', $responseIndex2->json('data.data.0.customer.phone'));
    }

    public function test_payment_failure_does_not_mark_booking_as_paid(): void
    {
        $category = ServiceCategory::create([
            'name' => 'Gardening',
            'slug' => 'gardening',
            'is_active' => true,
        ]);

        $worker = User::factory()->create([
            'role' => 'worker',
            'status' => 'Active',
            'verification' => 'Verified',
        ]);

        $package = ServicePackage::create([
            'user_id' => $worker->id,
            'service_category_id' => $category->id,
            'title' => 'Lawn Mowing',
            'slug' => 'lawn-mowing',
            'price' => 10000,
            'is_active' => true,
        ]);

        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $customerToken = $customer->issueApiToken();

        // 1. Simulate failed checkout/advance payment transaction
        $response = $this->withHeader('Authorization', 'Bearer '.$customerToken)
            ->postJson('/api/v1/auth/bookings', [
                'service_package_id' => $package->id,
                'scheduled_at' => now()->addDay()->toIso8601String(),
                'address' => '123 Main St, Colombo',
                'payment_option' => 'advance',
                'simulate_payment_failure' => true,
            ])
            ->assertCreated();

        $bookingId = $response->json('data.id');

        // 2. Booking status is still pending and advance_paid is 0.00 (not marked as paid)
        $this->assertDatabaseHas('bookings', [
            'id' => $bookingId,
            'status' => 'pending',
            'advance_paid' => 0.00,
            'payment_option' => 'advance',
        ]);

        // 3. Payment record exists but its status is marked as 'failed'
        $this->assertDatabaseHas('payments', [
            'booking_id' => $bookingId,
            'status' => 'failed',
            'amount' => 5250.00, // (10000 * 1.05) / 2
        ]);
    }

    public function test_worker_subscription_plan_change_affects_visibility_and_priority_instantly(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $adminToken = $admin->issueApiToken();

        $category = ServiceCategory::create([
            'name' => 'Gardening',
            'slug' => 'gardening',
            'is_active' => true,
        ]);

        $premiumPlan = \App\Models\PricingPlan::create([
            'title' => 'Premium Plan',
            'slug' => 'premium-plan',
            'price' => 5000,
            'billing_cycle' => 'Monthly',
            'status' => 'Active',
            'is_active' => true,
        ]);

        // Worker A: Free plan, verified, active
        $workerA = User::factory()->create([
            'role' => 'worker',
            'status' => 'Active',
            'verification' => 'Verified',
        ]);
        ServicePackage::create([
            'user_id' => $workerA->id,
            'service_category_id' => $category->id,
            'title' => 'Service A',
            'slug' => 'service-a',
            'price' => 1000,
            'is_active' => true,
        ]);

        // Worker B: Free plan, verified, active
        $workerB = User::factory()->create([
            'role' => 'worker',
            'status' => 'Active',
            'verification' => 'Verified',
        ]);
        ServicePackage::create([
            'user_id' => $workerB->id,
            'service_category_id' => $category->id,
            'title' => 'Service B',
            'slug' => 'service-b',
            'price' => 1000,
            'is_active' => true,
        ]);

        // Clear cache
        \Illuminate\Support\Facades\Cache::forever('services:list:version', (string) microtime(true));

        // Initial search: Worker A and B are visible
        $response1 = $this->getJson('/api/v1/services?category=gardening')
            ->assertOk();
        $this->assertCount(2, $response1->json('data.data'));

        // 1. Admin assigns Premium Plan to Worker B
        $this->withHeader('Authorization', 'Bearer '.$adminToken)
            ->patchJson('/api/v1/admin/users/'.$workerB->id.'/pricing-plan', [
                'pricing_plan_id' => $premiumPlan->id,
            ])
            ->assertOk();

        // 2. Search immediately reflects priority change (Worker B is first)
        $response2 = $this->getJson('/api/v1/services?category=gardening')
            ->assertOk();
        
        $data2 = $response2->json('data.data');
        $this->assertCount(2, $data2);
        $this->assertEquals('Service B', $data2[0]['title']); // Priority changed instantly

        // 3. Admin suspends Worker B
        $this->withHeader('Authorization', 'Bearer '.$adminToken)
            ->patchJson('/api/v1/admin/workers/'.$workerB->id, [
                'status' => 'Suspended',
                'verification' => 'Verified',
            ])
            ->assertOk();

        // 4. Search immediately reflects visibility change (Worker B is hidden)
        $response3 = $this->getJson('/api/v1/services?category=gardening')
            ->assertOk();
        
        $data3 = $response3->json('data.data');
        $this->assertCount(1, $data3);
        $this->assertEquals('Service A', $data3[0]['title']); // Visibility changed instantly
    }

    public function test_cancel_booking_under_24_hours_applies_fifty_percent_penalty(): void
    {
        $category = ServiceCategory::create([
            'name' => 'Gardening',
            'slug' => 'gardening',
            'is_active' => true,
        ]);

        $worker = User::factory()->create([
            'role' => 'worker',
            'status' => 'Active',
            'verification' => 'Verified',
        ]);

        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $servicePackage = ServicePackage::create([
            'user_id' => $worker->id,
            'service_category_id' => $category->id,
            'title' => 'Lawn Mowing',
            'slug' => 'lawn-mowing',
            'price' => 10000,
            'is_active' => true,
        ]);

        // Scheduled 2 hours from now (<24 hours)
        $booking = Booking::create([
            'customer_id' => $customer->id,
            'worker_id' => $worker->id,
            'service_package_id' => $servicePackage->id,
            'scheduled_at' => now()->addHours(2),
            'address' => '123 Main St, Colombo',
            'total_price' => 10000,
            'status' => 'confirmed',
            'advance_paid' => 5250.00,
            'payment_option' => 'advance',
        ]);

        $customerToken = $customer->issueApiToken();

        // Cancel
        $this->withHeader('Authorization', 'Bearer '.$customerToken)
            ->patchJson('/api/v1/auth/bookings/'.$booking->id.'/cancel', [
                'reason' => 'Change of mind',
            ])
            ->assertOk();

        // 50% penalty applied, meaning 50% of 5250.00 (=2625.00) is refunded to customer wallet
        $this->assertDatabaseHas('wallets', [
            'user_id' => $customer->id,
            'balance' => 2625.00,
        ]);

        // Negative refund payment logged
        $this->assertDatabaseHas('payments', [
            'booking_id' => $booking->id,
            'amount' => -2625.00,
            'status' => 'completed',
        ]);
    }

    public function test_cancel_booking_over_24_hours_applies_no_penalty(): void
    {
        $category = ServiceCategory::create([
            'name' => 'Gardening',
            'slug' => 'gardening',
            'is_active' => true,
        ]);

        $worker = User::factory()->create([
            'role' => 'worker',
            'status' => 'Active',
            'verification' => 'Verified',
        ]);

        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $servicePackage = ServicePackage::create([
            'user_id' => $worker->id,
            'service_category_id' => $category->id,
            'title' => 'Lawn Mowing',
            'slug' => 'lawn-mowing',
            'price' => 10000,
            'is_active' => true,
        ]);

        // Scheduled 3 days from now (>24 hours)
        $booking = Booking::create([
            'customer_id' => $customer->id,
            'worker_id' => $worker->id,
            'service_package_id' => $servicePackage->id,
            'scheduled_at' => now()->addDays(3),
            'address' => '123 Main St, Colombo',
            'total_price' => 10000,
            'status' => 'confirmed',
            'advance_paid' => 5250.00,
            'payment_option' => 'advance',
        ]);

        $customerToken = $customer->issueApiToken();

        // Cancel
        $this->withHeader('Authorization', 'Bearer '.$customerToken)
            ->patchJson('/api/v1/auth/bookings/'.$booking->id.'/cancel', [
                'reason' => 'Too far out',
            ])
            ->assertOk();

        // 100% of 5250.00 refunded
        $this->assertDatabaseHas('wallets', [
            'user_id' => $customer->id,
            'balance' => 5250.00,
        ]);

        // Negative full refund logged
        $this->assertDatabaseHas('payments', [
            'booking_id' => $booking->id,
            'amount' => -5250.00,
            'status' => 'completed',
        ]);
    }

    public function test_customer_can_request_refund(): void
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

        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $servicePackage = ServicePackage::create([
            'user_id' => $worker->id,
            'service_category_id' => $category->id,
            'title' => 'Deep Cleaning',
            'slug' => 'deep-cleaning',
            'price' => 5000,
            'is_active' => true,
        ]);

        $booking = Booking::create([
            'customer_id' => $customer->id,
            'worker_id' => $worker->id,
            'service_package_id' => $servicePackage->id,
            'scheduled_at' => now()->addDays(3),
            'address' => '123 Main St, Colombo',
            'total_price' => 5000,
            'status' => 'cancelled',
            'advance_paid' => 2500.00,
            'payment_option' => 'advance',
        ]);

        $payment = $booking->payments()->create([
            'gateway_reference' => 'pay_test_refund',
            'amount' => 2500.00,
            'status' => 'completed',
            'currency' => 'LKR',
            'verified_at' => now(),
        ]);

        $customerToken = $customer->issueApiToken();

        $this->withHeader('Authorization', 'Bearer '.$customerToken)
            ->postJson('/api/v1/auth/bookings/'.$booking->id.'/refund-request')
            ->assertOk()
            ->assertJsonPath('message', 'Refund request submitted successfully.');

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'refund_requested',
        ]);
    }

    public function test_admin_can_list_refund_requests(): void
    {
        $category = ServiceCategory::create(['name' => 'Cleaning', 'slug' => 'cleaning', 'is_active' => true]);
        $worker = User::factory()->create(['role' => 'worker', 'phone' => '94771234567', 'status' => 'Active', 'verification' => 'Verified']);
        $customer = User::factory()->create(['role' => 'customer']);
        $servicePackage = ServicePackage::create(['user_id' => $worker->id, 'service_category_id' => $category->id, 'title' => 'Deep Cleaning', 'slug' => 'deep-cleaning', 'price' => 5000, 'is_active' => true]);
        $booking = Booking::create(['customer_id' => $customer->id, 'worker_id' => $worker->id, 'service_package_id' => $servicePackage->id, 'address' => 'Colombo', 'total_price' => 5000, 'status' => 'cancelled']);
        $payment = $booking->payments()->create(['gateway_reference' => 'pay_test', 'amount' => 5000, 'status' => 'refund_requested', 'currency' => 'LKR']);

        $admin = User::factory()->create(['role' => 'admin']);
        $adminToken = $admin->issueApiToken();

        $this->withHeader('Authorization', 'Bearer '.$adminToken)
            ->getJson('/api/v1/admin/refunds')
            ->assertOk()
            ->assertJsonPath('data.data.0.id', $payment->id);
    }

    public function test_admin_can_approve_refund(): void
    {
        $category = ServiceCategory::create(['name' => 'Cleaning', 'slug' => 'cleaning', 'is_active' => true]);
        $worker = User::factory()->create(['role' => 'worker', 'phone' => '94771234567', 'status' => 'Active', 'verification' => 'Verified']);
        $customer = User::factory()->create(['role' => 'customer']);
        $servicePackage = ServicePackage::create(['user_id' => $worker->id, 'service_category_id' => $category->id, 'title' => 'Deep Cleaning', 'slug' => 'deep-cleaning', 'price' => 5000, 'is_active' => true]);
        $booking = Booking::create(['customer_id' => $customer->id, 'worker_id' => $worker->id, 'service_package_id' => $servicePackage->id, 'address' => 'Colombo', 'total_price' => 5000, 'status' => 'cancelled']);
        $payment = $booking->payments()->create(['gateway_reference' => 'pay_test', 'amount' => 5000, 'status' => 'refund_requested', 'currency' => 'LKR']);

        $admin = User::factory()->create(['role' => 'admin']);
        $adminToken = $admin->issueApiToken();

        $this->withHeader('Authorization', 'Bearer '.$adminToken)
            ->postJson('/api/v1/admin/refunds/'.$payment->id.'/approve')
            ->assertOk()
            ->assertJsonPath('message', 'Refund request approved successfully.');

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'refunded',
        ]);

        $this->assertDatabaseHas('wallets', [
            'user_id' => $customer->id,
            'balance' => 5000.00,
        ]);
    }

    public function test_admin_can_reject_refund(): void
    {
        $category = ServiceCategory::create(['name' => 'Cleaning', 'slug' => 'cleaning', 'is_active' => true]);
        $worker = User::factory()->create(['role' => 'worker', 'phone' => '94771234567', 'status' => 'Active', 'verification' => 'Verified']);
        $customer = User::factory()->create(['role' => 'customer']);
        $servicePackage = ServicePackage::create(['user_id' => $worker->id, 'service_category_id' => $category->id, 'title' => 'Deep Cleaning', 'slug' => 'deep-cleaning', 'price' => 5000, 'is_active' => true]);
        $booking = Booking::create(['customer_id' => $customer->id, 'worker_id' => $worker->id, 'service_package_id' => $servicePackage->id, 'address' => 'Colombo', 'total_price' => 5000, 'status' => 'cancelled']);
        $payment = $booking->payments()->create(['gateway_reference' => 'pay_test', 'amount' => 5000, 'status' => 'refund_requested', 'currency' => 'LKR']);

        $admin = User::factory()->create(['role' => 'admin']);
        $adminToken = $admin->issueApiToken();

        $this->withHeader('Authorization', 'Bearer '.$adminToken)
            ->postJson('/api/v1/admin/refunds/'.$payment->id.'/reject')
            ->assertOk()
            ->assertJsonPath('message', 'Refund request rejected successfully.');

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'completed',
        ]);
    }

    public function test_worker_can_save_manual_district_location(): void
    {
        $worker = User::factory()->create([
            'role' => 'worker',
            'phone' => '94771234567',
        ]);
        $token = $worker->issueApiToken();

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/profile', [
                'district' => 'Kandy',
            ])
            ->assertOk()
            ->assertJsonPath('data.user.district', 'Kandy');

        $this->assertDatabaseHas('users', [
            'id' => $worker->id,
            'district' => 'Kandy',
        ]);
    }

    public function test_customer_can_search_by_district(): void
    {
        $category = ServiceCategory::create([
            'name' => 'Cleaning',
            'slug' => 'cleaning',
            'is_active' => true,
        ]);

        $workerA = User::factory()->create([
            'role' => 'worker',
            'phone' => '94771111111',
            'phone_verified_at' => now(),
            'status' => 'Active',
            'verification' => 'Verified',
            'district' => 'Colombo',
        ]);

        $workerB = User::factory()->create([
            'role' => 'worker',
            'phone' => '94772222222',
            'phone_verified_at' => now(),
            'status' => 'Active',
            'verification' => 'Verified',
            'district' => 'Kandy',
        ]);

        $packageA = ServicePackage::create([
            'user_id' => $workerA->id,
            'service_category_id' => $category->id,
            'title' => 'Colombo Cleaners',
            'slug' => 'colombo-cleaners',
            'price' => 3000,
            'is_active' => true,
        ]);

        $packageB = ServicePackage::create([
            'user_id' => $workerB->id,
            'service_category_id' => $category->id,
            'title' => 'Kandy Cleaners',
            'slug' => 'kandy-cleaners',
            'price' => 4000,
            'is_active' => true,
        ]);

        $this->getJson('/api/v1/services?district=Colombo')
            ->assertOk()
            ->assertJsonPath('data.data.0.title', 'Colombo Cleaners')
            ->assertJsonCount(1, 'data.data');
    }
}







