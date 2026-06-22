<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\NotificationLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class NotificationDeliveryLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_email_notification_delivery_is_logged_successfully(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        
        $customer = User::factory()->create([
            'role' => 'customer',
            'email' => 'customer@example.com',
            'phone' => '94771234567',
        ]);

        $token = $admin->issueApiToken();

        Log::spy();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/admin/notifications/send', [
                'channel' => 'email',
                'audience' => 'customers',
                'subject' => 'Test Email Subject',
                'message' => 'Test Email Message',
            ]);

        $response->assertOk();

        // Check if database log is created
        $this->assertDatabaseHas('notification_logs', [
            'channel' => 'email',
            'audience' => 'customers',
            'subject' => 'Test Email Subject',
            'message' => 'Test Email Message',
        ]);

        // Check if delivery was successfully logged into the system logger
        Log::shouldHaveReceived('info')->withArgs(function ($message) use ($customer) {
            return str_contains($message, 'Email notification sent to ' . $customer->email) &&
                   str_contains($message, 'Test Email Subject') &&
                   str_contains($message, 'Test Email Message');
        });
    }
    
    public function test_sms_notification_delivery_is_logged_successfully(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        
        $worker = User::factory()->create([
            'role' => 'worker',
            'phone' => '94771234568',
        ]);

        $token = $admin->issueApiToken();

        Log::spy();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/admin/notifications/send', [
                'channel' => 'sms',
                'audience' => 'workers',
                'message' => 'Test SMS Message',
            ]);

        $response->assertOk();

        // Check if database log is created
        $this->assertDatabaseHas('notification_logs', [
            'channel' => 'sms',
            'audience' => 'workers',
            'message' => 'Test SMS Message',
        ]);

        // Check if delivery was successfully logged into the system logger
        Log::shouldHaveReceived('info')->withArgs(function ($message) use ($worker) {
            return str_contains($message, 'SMS notification sent to ' . $worker->phone) &&
                   str_contains($message, 'Test SMS Message');
        });
    }
}
