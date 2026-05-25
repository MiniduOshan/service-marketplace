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

        $this->getJson('/api/categories')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Painting');

        $this->getJson('/api/services?category=painting')
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
            ->postJson('/api/auth/worker/services', [
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
            ->postJson('/api/auth/bookings', [
                'service_package_id' => $servicePackage->id,
                'scheduled_at' => now()->addDay()->toIso8601String(),
                'address' => '123 Main Street, Colombo',
                'notes' => 'Please bring supplies',
            ]);

        $createResponse->assertCreated()
            ->assertJsonPath('data.status', 'pending');

        $bookingId = $createResponse->json('data.id');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->patchJson('/api/auth/bookings/'.$bookingId.'/cancel')
            ->assertOk()
            ->assertJsonPath('data.status', 'cancelled');

        $this->assertDatabaseHas('bookings', [
            'id' => $bookingId,
            'status' => 'cancelled',
        ]);
    }
}