<?php

namespace Tests\Feature\Api;

use App\Models\Booking;
use App\Models\ServiceCategory;
use App\Models\ServicePackage;
use App\Models\User;
use App\Models\Review;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    private User $customer;
    private User $worker;
    private Booking $completedBooking;
    private Booking $pendingBooking;

    protected function setUp(): void
    {
        parent::setUp();

        $this->customer = User::factory()->create([
            'role' => 'customer',
            'phone' => '94777654321',
            'phone_verified_at' => now(),
        ]);

        $this->worker = User::factory()->create([
            'role' => 'worker',
            'phone' => '94771234567',
            'phone_verified_at' => now(),
        ]);

        $category = ServiceCategory::create([
            'name' => 'Painting',
            'slug' => 'painting',
            'description' => 'Painting services',
            'is_active' => true,
        ]);

        $servicePackage = ServicePackage::create([
            'user_id' => $this->worker->id,
            'service_category_id' => $category->id,
            'title' => 'Walls Painting',
            'slug' => 'walls-painting',
            'description' => 'Walls painting description',
            'price' => 2000,
            'duration_minutes' => 120,
            'location_type' => 'onsite',
            'is_active' => true,
        ]);

        $this->completedBooking = Booking::create([
            'customer_id' => $this->customer->id,
            'worker_id' => $this->worker->id,
            'service_package_id' => $servicePackage->id,
            'scheduled_at' => now(),
            'address' => '123 Main St',
            'total_price' => 2000,
            'status' => 'completed',
        ]);

        $this->pendingBooking = Booking::create([
            'customer_id' => $this->customer->id,
            'worker_id' => $this->worker->id,
            'service_package_id' => $servicePackage->id,
            'scheduled_at' => now()->addDay(),
            'address' => '123 Main St',
            'total_price' => 2000,
            'status' => 'pending',
        ]);
    }

    public function test_unauthenticated_user_cannot_submit_review(): void
    {
        $this->postJson("/api/auth/bookings/{$this->completedBooking->id}/reviews", [
            'rating' => 5,
            'comment' => 'Great work!',
        ])->assertStatus(401);
    }

    public function test_customer_cannot_review_someone_elses_booking(): void
    {
        $otherCustomer = User::factory()->create([
            'role' => 'customer',
            'phone' => '94770000000',
            'phone_verified_at' => now(),
        ]);

        $token = $otherCustomer->issueApiToken();

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson("/api/auth/bookings/{$this->completedBooking->id}/reviews", [
                'rating' => 5,
                'comment' => 'Great work!',
            ])->assertStatus(403);
    }

    public function test_customer_cannot_review_incomplete_booking(): void
    {
        $token = $this->customer->issueApiToken();

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson("/api/auth/bookings/{$this->pendingBooking->id}/reviews", [
                'rating' => 5,
                'comment' => 'Nice!',
            ])->assertStatus(422);
    }

    public function test_customer_can_successfully_submit_review(): void
    {
        $token = $this->customer->issueApiToken();

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson("/api/auth/bookings/{$this->completedBooking->id}/reviews", [
                'rating' => 4,
                'comment' => 'Good job but delayed slightly.',
            ])->assertCreated()
            ->assertJsonPath('data.rating', 4)
            ->assertJsonPath('data.comment', 'Good job but delayed slightly.');

        $this->assertDatabaseHas('reviews', [
            'booking_id' => $this->completedBooking->id,
            'customer_id' => $this->customer->id,
            'worker_id' => $this->worker->id,
            'rating' => 4,
            'comment' => 'Good job but delayed slightly.',
        ]);
    }

    public function test_customer_cannot_submit_duplicate_review(): void
    {
        Review::create([
            'booking_id' => $this->completedBooking->id,
            'customer_id' => $this->customer->id,
            'worker_id' => $this->worker->id,
            'rating' => 5,
            'comment' => 'First review',
        ]);

        $token = $this->customer->issueApiToken();

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson("/api/auth/bookings/{$this->completedBooking->id}/reviews", [
                'rating' => 3,
                'comment' => 'Duplicate attempt',
            ])->assertStatus(422);
    }

    public function test_anyone_can_fetch_worker_reviews_publicly(): void
    {
        Review::create([
            'booking_id' => $this->completedBooking->id,
            'customer_id' => $this->customer->id,
            'worker_id' => $this->worker->id,
            'rating' => 5,
            'comment' => 'Excellent service!',
        ]);

        $this->getJson("/api/workers/{$this->worker->id}/reviews")
            ->assertOk()
            ->assertJsonPath('data.0.comment', 'Excellent service!')
            ->assertJsonPath('data.0.customer.name', $this->customer->name);
    }
}
