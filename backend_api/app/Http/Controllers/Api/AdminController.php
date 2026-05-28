<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function workers(): JsonResponse
    {
        $workers = User::where('role', 'worker')->with(['category', 'pricingPlan'])->get()->map(function ($worker) {
            return [
                'id' => $worker->id,
                'name' => $worker->name,
                'email' => $worker->email,
                'status' => $worker->status ?? 'Active',
                'verification' => $worker->verification ?? 'Pending verification',
                'category' => $worker->category ? $worker->category->name : 'General',
                'city' => 'Colombo',
                'pricing_plan' => $worker->pricingPlan ? $worker->pricingPlan->title : 'Free Usage',
                'pricing_plan_id' => $worker->pricing_plan_id,
            ];
        });

        return response()->json(['data' => $workers]);
    }

    public function updateWorker(Request $request, $id): JsonResponse
    {
        $worker = User::where('role', 'worker')->findOrFail($id);
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:Active,Suspended'],
            'verification' => ['required', 'string', 'in:Pending verification,Verified,Rejected'],
        ]);

        $worker->update($validated);

        return response()->json([
            'message' => 'Worker updated successfully.',
            'data' => $worker,
        ]);
    }

    public function customers(): JsonResponse
    {
        $customers = User::where('role', 'customer')->with('pricingPlan')->get()->map(function ($customer) {
            $bookingsCount = DB::table('bookings')->where('customer_id', $customer->id)->count();
            return [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'status' => $customer->status ?? 'Active',
                'bookings' => $bookingsCount,
                'lastActive' => $customer->updated_at ? $customer->updated_at->diffForHumans() : 'Just now',
                'pricing_plan' => $customer->pricingPlan ? $customer->pricingPlan->title : 'Free Usage',
                'pricing_plan_id' => $customer->pricing_plan_id,
            ];
        });

        return response()->json(['data' => $customers]);
    }

    public function updateCustomer(Request $request, $id): JsonResponse
    {
        $customer = User::where('role', 'customer')->findOrFail($id);
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:Active,Suspended'],
        ]);

        $customer->update($validated);

        return response()->json([
            'message' => 'Customer updated successfully.',
            'data' => $customer,
        ]);
    }

    public function privileges(): JsonResponse
    {
        $defaults = [
            ['key' => 'chat', 'label' => 'Chat access', 'description' => 'Allow workers and customers to message each other.', 'enabled' => true],
            ['key' => 'bookings', 'label' => 'Booking access', 'description' => 'Enable booking scheduling and workflow.', 'enabled' => true],
            ['key' => 'featuredProfile', 'label' => 'Featured profile', 'description' => 'Highlight top rated workers.', 'enabled' => false],
            ['key' => 'prioritySupport', 'label' => 'Priority support', 'description' => 'Show dedicated help lines to premium plans.', 'enabled' => false],
            ['key' => 'smsNotifications', 'label' => 'SMS notifications', 'description' => 'Send real-time alerts to phones.', 'enabled' => true],
            ['key' => 'emailNotifications', 'label' => 'Email notifications', 'description' => 'Send summaries and statements.', 'enabled' => true],
        ];

        $privileges = Setting::get('privileges', $defaults);

        return response()->json(['data' => $privileges]);
    }

    public function togglePrivilege(Request $request, $key): JsonResponse
    {
        $defaults = [
            ['key' => 'chat', 'label' => 'Chat access', 'description' => 'Allow workers and customers to message each other.', 'enabled' => true],
            ['key' => 'bookings', 'label' => 'Booking access', 'description' => 'Enable booking scheduling and workflow.', 'enabled' => true],
            ['key' => 'featuredProfile', 'label' => 'Featured profile', 'description' => 'Highlight top rated workers.', 'enabled' => false],
            ['key' => 'prioritySupport', 'label' => 'Priority support', 'description' => 'Show dedicated help lines to premium plans.', 'enabled' => false],
            ['key' => 'smsNotifications', 'label' => 'SMS notifications', 'description' => 'Send real-time alerts to phones.', 'enabled' => true],
            ['key' => 'emailNotifications', 'label' => 'Email notifications', 'description' => 'Send summaries and statements.', 'enabled' => true],
        ];

        $privileges = Setting::get('privileges', $defaults);
        foreach ($privileges as &$priv) {
            if ($priv['key'] === $key) {
                $priv['enabled'] = !$priv['enabled'];
            }
        }

        Setting::set('privileges', $privileges);

        return response()->json([
            'message' => 'Privilege toggled successfully.',
            'data' => $privileges,
        ]);
    }

    public function systemHealth(): JsonResponse
    {
        try {
            DB::connection()->getPdo();
            $dbStatus = 'Connected';
        } catch (\Exception $e) {
            $dbStatus = 'Error: ' . $e->getMessage();
        }

        $pricingCount = DB::table('pricing_plans')->count();
        $bookingsCount = DB::table('bookings')->count();

        return response()->json([
            'data' => [
                'db_status' => $dbStatus,
                'pricing_count' => $pricingCount,
                'bookings_count' => $bookingsCount,
            ],
        ]);
    }

    public function sendNotification(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'channel' => ['required', 'string', 'in:sms,email'],
            'audience' => ['required', 'string', 'in:all,workers,customers'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $validated['subject'] = isset($validated['subject']) ? strip_tags($validated['subject']) : null;
        $validated['message'] = strip_tags($validated['message']);

        $logs = Setting::get('notification_logs', []);
        $logs[] = array_merge($validated, ['timestamp' => now()->toIso8601String()]);
        Setting::set('notification_logs', $logs);

        return response()->json([
            'message' => strtoupper($validated['channel']) . ' notification prepared for ' . $validated['audience'] . '.',
        ]);
    }

    public function saveCredentials(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'smsSenderId' => 'nullable|string',
            'smsApiKey' => 'nullable|string',
            'smsApiSecret' => 'nullable|string',
            'paymentGatewayId' => 'nullable|string',
            'paymentGatewaySecret' => 'nullable|string',
            'webhookSecret' => 'nullable|string',
        ]);

        Setting::set('credentials', $validated);

        return response()->json([
            'message' => 'Credentials saved securely.',
        ]);
    }

    public function assignPricingPlan(Request $request, $userId): JsonResponse
    {
        $validated = $request->validate([
            'pricing_plan_id' => ['nullable', 'exists:pricing_plans,id'],
        ]);

        $user = User::findOrFail($userId);
        $user->update([
            'pricing_plan_id' => $validated['pricing_plan_id'],
        ]);

        return response()->json([
            'message' => 'User pricing plan updated successfully.',
            'data' => $user->load('pricingPlan'),
        ]);
    }
}
