<?php

namespace Tests\Feature\Api;

use App\Models\Booking;
use App\Models\ServiceCategory;
use App\Models\ServicePackage;
use App\Models\User;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_toggle_chat_privilege_and_app_behavior_updates(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $worker = User::factory()->create(['role' => 'worker', 'phone' => '94771234568', 'phone_verified_at' => now()]);
        $customer = User::factory()->create(['role' => 'customer', 'phone' => '94777654322', 'phone_verified_at' => now()]);

        $category = ServiceCategory::create(['name' => 'Gardening', 'slug' => 'gardening', 'is_active' => true]);

        $servicePackage = ServicePackage::create([
            'user_id' => $worker->id,
            'service_category_id' => $category->id,
            'title' => 'Lawn Mowing',
            'slug' => 'lawn-mowing',
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
            'address' => '456 Garden St',
            'total_price' => 1500,
            'status' => 'confirmed',
        ]);

        $adminToken = $admin->issueApiToken();
        $customerToken = $customer->issueApiToken();

        // 1. Initial State: Chat is enabled by default. Message should succeed.
        $this->withHeader('Authorization', 'Bearer ' . $customerToken)
            ->postJson('/api/v1/auth/bookings/' . $booking->id . '/messages', [
                'body' => 'Hello worker!',
            ])->assertCreated();

        // 2. Admin toggles the 'chat' privilege off.
        $response = $this->withHeader('Authorization', 'Bearer ' . $adminToken)
            ->postJson('/api/v1/admin/privileges/chat/toggle');
            
        $response->assertOk();
        $privileges = collect($response->json('data'));
        $chatPriv = $privileges->firstWhere('key', 'chat');
        $this->assertFalse($chatPriv['enabled']);

        // Verify the setting is saved in database properly
        $dbPrivileges = collect(Setting::get('privileges'));
        $this->assertFalse($dbPrivileges->firstWhere('key', 'chat')['enabled']);

        // 3. App Behavior Update: Chat is disabled. Message should be blocked (403).
        $this->withHeader('Authorization', 'Bearer ' . $customerToken)
            ->postJson('/api/v1/auth/bookings/' . $booking->id . '/messages', [
                'body' => 'This should fail.',
            ])
            ->assertStatus(403)
            ->assertJsonPath('message', 'The chat feature is currently disabled by the administrator.');
            
        // 4. Admin toggles chat back on
        $this->withHeader('Authorization', 'Bearer ' . $adminToken)
            ->postJson('/api/v1/admin/privileges/chat/toggle')
            ->assertOk();
            
        // 5. Customer can message again
        $this->withHeader('Authorization', 'Bearer ' . $customerToken)
            ->postJson('/api/v1/auth/bookings/' . $booking->id . '/messages', [
                'body' => 'Back online!',
            ])->assertCreated();
    }
}
