<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Setting;
use App\Models\NotificationLog;
use App\Models\Notification;
use App\Models\Booking;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboardStats(): JsonResponse
    {
        $stats = \Illuminate\Support\Facades\Cache::remember('admin:dashboard:stats', now()->addMinutes(10), function () {
            $totalWorkers = User::where('role', 'worker')->count();
            $activeWorkers = User::where('role', 'worker')->where('status', 'Active')->count();
            $totalCustomers = User::where('role', 'customer')->count();
            $activeCustomers = User::where('role', 'customer')->where('status', 'Active')->count();

            $totalBookings = Booking::count();
            $completedBookings = Booking::where('status', 'completed')->count();
            $totalRevenue = Booking::where('status', 'completed')->sum('total_price');

            return [
                'totalWorkers' => $totalWorkers,
                'activeWorkers' => $activeWorkers,
                'totalCustomers' => $totalCustomers,
                'activeCustomers' => $activeCustomers,
                'totalBookings' => $totalBookings,
                'completedBookings' => $completedBookings,
                'totalRevenue' => (float)$totalRevenue,
            ];
        });

        $recentUsers = User::orderBy('created_at', 'desc')->take(5)->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role,
                'status' => $user->status,
                'created_at' => $user->created_at->diffForHumans()
            ];
        });

        return response()->json([
            'stats' => $stats,
            'recentActivity' => $recentUsers
        ]);
    }
    public function workers(): JsonResponse
    {
        $workers = User::where('role', 'worker')->with(['category', 'pricingPlan', 'servicePackages.category'])->paginate(50);
        
        $workers->getCollection()->transform(function ($worker) {
            $categoryName = 'General';
            if ($worker->category) {
                $categoryName = $worker->category->name;
            } else {
                $firstPackage = $worker->servicePackages->where('is_active', true)->first();
                if ($firstPackage && $firstPackage->category) {
                    $categoryName = $firstPackage->category->name;
                }
            }

            return [
                'id' => $worker->id,
                'name' => $worker->name,
                'email' => $worker->email,
                'phone' => $worker->phone,
                'status' => $worker->status ?? 'Active',
                'verification' => $worker->verification ?? 'Pending verification',
                'priority_score' => (int) $worker->priority_score,
                'category' => $categoryName,
                'city' => $worker->city ?? 'Colombo',
                'bio' => $worker->bio,
                'nic_front' => $worker->nic_front,
                'nic_back' => $worker->nic_back,
                'certificates' => $worker->certificates,
                'police_clearance' => $worker->police_clearance,
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
            'status' => ['sometimes', 'string', 'in:Active,Suspended'],
            'verification' => ['sometimes', 'string', 'in:Verified,Rejected,Pending verification'],
            'priority_score' => ['sometimes', 'integer', 'min:0', 'max:999'],
        ]);

        $worker->update($validated);

        \Illuminate\Support\Facades\Cache::forever('services:list:version', (string) microtime(true));

        return response()->json([
            'message' => 'Worker updated successfully.',
            'data' => $worker,
        ]);
    }

    public function customers(): JsonResponse
    {
        $customers = User::where('role', 'customer')->with('pricingPlan')->withCount('customerBookings')->paginate(50);
        
        $customers->getCollection()->transform(function ($customer) {
            $bookingsCount = $customer->customer_bookings_count;
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
            'audience' => ['required', 'string', 'in:all,workers,customers,pending-workers'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $validated['subject'] = isset($validated['subject']) ? strip_tags($validated['subject']) : null;
        $validated['message'] = strip_tags($validated['message']);

        NotificationLog::create([
            'channel' => $validated['channel'],
            'audience' => $validated['audience'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
        ]);

        // Retention policy: delete logs older than 30 days
        NotificationLog::where('created_at', '<', now()->subDays(30))->delete();

        // Fetch target users based on audience
        $usersQuery = User::query();
        if ($validated['audience'] === 'workers') {
            $usersQuery->where('role', 'worker');
        } elseif ($validated['audience'] === 'customers') {
            $usersQuery->where('role', 'customer');
        } elseif ($validated['audience'] === 'pending-workers') {
            $usersQuery->where('role', 'worker')->where('verification', 'Pending verification');
        } else {
            // 'all': get both customers and workers, excluding admin
            $usersQuery->whereIn('role', ['customer', 'worker']);
        }
        $users = $usersQuery->get();

        // Dispatch notifications and log external sending
        foreach ($users as $user) {
            // Create in-app notification
            Notification::create([
                'user_id' => $user->id,
                'title' => $validated['subject'] ?: 'System Announcement',
                'message' => $validated['message'],
                'type' => 'system',
                'unread' => true,
            ]);

            // Simulate external email/SMS sending
            if ($validated['channel'] === 'email') {
                Log::info("Email notification sent to {$user->email} | Subject: {$validated['subject']} | Body: {$validated['message']}");
            } else {
                Log::info("SMS notification sent to {$user->phone} | Body: {$validated['message']}");
            }
        }

        return response()->json([
            'message' => strtoupper($validated['channel']) . ' notification dispatched to ' . $validated['audience'] . '.',
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

        \Illuminate\Support\Facades\Cache::forever('services:list:version', (string) microtime(true));

        return response()->json([
            'message' => 'User pricing plan updated successfully.',
            'data' => $user->load('pricingPlan'),
        ]);
    }

    public function deleteUser($id): JsonResponse
    {
        $user = User::findOrFail($id);

        DB::transaction(function () use ($user) {
            $bookingIds = DB::table('bookings')
                ->where('customer_id', $user->id)
                ->orWhere('worker_id', $user->id)
                ->pluck('id');

            // Delete records that depend on bookings first.
            if ($bookingIds->isNotEmpty()) {
                DB::table('booking_messages')->whereIn('booking_id', $bookingIds)->delete();
                DB::table('payments')->whereIn('booking_id', $bookingIds)->delete();
                DB::table('reviews')->whereIn('booking_id', $bookingIds)->delete();
                DB::table('bookings')->whereIn('id', $bookingIds)->delete();
            }

            // Delete remaining user-linked records.
            DB::table('booking_messages')->where('sender_id', $user->id)->delete();
            DB::table('reviews')->where('worker_id', $user->id)->orWhere('customer_id', $user->id)->delete();
            DB::table('notifications')->where('user_id', $user->id)->delete();
            DB::table('wallets')->where('user_id', $user->id)->delete();
            DB::table('service_packages')->where('user_id', $user->id)->delete();

            // notification_logs is an admin broadcast log table in this project,
            // so it does not have a user_id column and should not be deleted by user.

            $user->delete();
        });

        // Clear general caches
        \Illuminate\Support\Facades\Cache::forget('public:stats');
        \Illuminate\Support\Facades\Cache::forget('admin:dashboard:stats');
        \Illuminate\Support\Facades\Cache::forever('services:list:version', (string) microtime(true));

        return response()->json([
            'message' => 'User and all associated data deleted successfully.',
        ]);
    }

    public function listRefunds(Request $request): JsonResponse
    {
        $refunds = \App\Models\Payment::query()
            ->with(['booking.customer', 'booking.worker', 'booking.servicePackage.category'])
            ->where('status', 'refund_requested')
            ->latest()
            ->paginate(50);

        return response()->json([
            'data' => $refunds,
        ]);
    }

    public function approveRefund(Request $request, $id): JsonResponse
    {
        $payment = \App\Models\Payment::whereKey($id)->firstOrFail();
        abort_unless($payment->status === 'refund_requested', 422, 'This payment does not have a pending refund request.');

        $payment = DB::transaction(function () use ($payment) {
            $payment->update([
                'status' => 'refunded',
            ]);

            $hasNegativePayment = \App\Models\Payment::query()
                ->where('booking_id', $payment->booking_id)
                ->where('amount', '<', 0)
                ->exists();

            if (!$hasNegativePayment) {
                $customer = $payment->booking->customer;
                if ($customer) {
                    $wallet = $customer->wallet()->lockForUpdate()->firstOrCreate([], ['balance' => 0.00]);
                    $wallet->increment('balance', $payment->amount);
                }

                $payment->booking->payments()->create([
                    'gateway_reference' => 'ref_' . \Illuminate\Support\Str::random(16),
                    'amount' => -$payment->amount,
                    'status' => 'completed',
                    'currency' => $payment->currency,
                    'verified_at' => now(),
                ]);
            }

            return $payment;
        });

        \App\Models\Notification::create([
            'user_id' => $payment->booking->customer_id,
            'title' => 'Refund Approved',
            'message' => "Your refund request for booking #{$payment->booking_id} has been approved.",
            'type' => 'system',
        ]);

        return response()->json([
            'message' => 'Refund request approved successfully.',
            'data' => $payment->load(['booking.customer', 'booking.worker']),
        ]);
    }

    public function rejectRefund(Request $request, $id): JsonResponse
    {
        $payment = \App\Models\Payment::whereKey($id)->firstOrFail();
        abort_unless($payment->status === 'refund_requested', 422, 'This payment does not have a pending refund request.');

        $payment->update([
            'status' => 'completed',
        ]);

        \App\Models\Notification::create([
            'user_id' => $payment->booking->customer_id,
            'title' => 'Refund Rejected',
            'message' => "Your refund request for booking #{$payment->booking_id} has been rejected.",
            'type' => 'system',
        ]);

        return response()->json([
            'message' => 'Refund request rejected successfully.',
            'data' => $payment->load(['booking.customer', 'booking.worker']),
        ]);
    }

    public function setSystemMode(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'mode' => ['required', 'string', 'in:live,maintenance'],
        ]);

        \App\Models\Setting::set('system_mode', $validated['mode']);

        return response()->json([
            'message' => 'System mode updated successfully.',
            'mode' => $validated['mode']
        ]);
    }
}
