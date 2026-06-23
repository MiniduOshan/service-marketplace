<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\ServiceCategory;
use App\Models\ServicePackage;
use App\Models\Booking;

class CancellationLimitTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_cannot_cancel_more_than_limit()
    {
        $customer = User::factory()->create(['role' => 'customer', 'phone_verified_at' => now()]);
        $worker = User::factory()->create(['role' => 'worker']);
        
        $category = ServiceCategory::create([
            'name' => 'Plumbing',
            'slug' => 'plumbing',
            'icon' => 'wrench'
        ]);

        $package = ServicePackage::create([
            'user_id' => $worker->id,
            'service_category_id' => $category->id,
            'title' => 'Fix Leaks',
            'slug' => 'fix-leaks',
            'price' => 500,
            'features' => ['Fix fast'],
            'is_active' => true
        ]);

        $token = $customer->issueApiToken();

        for ($i = 0; $i < 3; $i++) {
            $booking = Booking::create([
                'customer_id' => $customer->id,
                'worker_id' => $worker->id,
                'service_package_id' => $package->id,
                'status' => 'pending',
                'title' => 'Leak fix',
                'description' => 'Fix the leak',
                'location' => 'Home',
                'address' => '123 Test St',
                'total_price' => 500
            ]);

            $response = $this->withHeader('Authorization', 'Bearer ' . $token)->patchJson("/api/v1/auth/bookings/{$booking->id}/cancel", ['reason' => 'test']);
            $response->assertStatus(200);
        }

        $booking4 = Booking::create([
            'customer_id' => $customer->id,
            'worker_id' => $worker->id,
            'service_package_id' => $package->id,
            'status' => 'pending',
            'title' => 'Leak fix 4',
            'description' => 'Fix the leak',
            'location' => 'Home',
            'address' => '123 Test St',
            'total_price' => 500
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)->patchJson("/api/v1/auth/bookings/{$booking4->id}/cancel", ['reason' => 'test']);
        $response->assertStatus(429);
    }
}
