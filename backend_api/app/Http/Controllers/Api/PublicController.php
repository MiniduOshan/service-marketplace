<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ServiceCategory;
use Illuminate\Http\JsonResponse;

class PublicController extends Controller
{
    public function stats(): JsonResponse
    {
        $stats = \Illuminate\Support\Facades\Cache::remember('public:stats', now()->addMinutes(10), function () {
            $privileges = \App\Models\Setting::get('privileges', []);
            $workerApprovalEnabled = false;
            if (!empty($privileges)) {
                $found = false;
                foreach ($privileges as $priv) {
                    if (($priv['key'] ?? '') === 'workerApproval') {
                        $workerApprovalEnabled = $priv['enabled'] ?? false;
                        $found = true;
                        break;
                    }
                }
                if (!$found) {
                    $workerApprovalEnabled = false;
                }
            }

            $customersCount = User::where('role', 'customer')->count();
            
            $workersQuery = User::where('role', 'worker')->where('status', 'Active');
            if ($workerApprovalEnabled) {
                $workersQuery->where('verification', 'Verified');
            } else {
                $workersQuery->where('verification', '!=', 'Rejected');
            }
            $workersCount = $workersQuery->count();
            
            $categoriesCount = ServiceCategory::count();

            return [
                'customers' => $customersCount,
                'workers' => $workersCount,
                'categories' => $categoriesCount,
            ];
        });

        return response()->json($stats);
    }
    public function config(): JsonResponse
    {
        $defaults = [
            ['key' => 'chat', 'enabled' => true],
            ['key' => 'bookings', 'enabled' => true],
            ['key' => 'featuredProfile', 'enabled' => false],
            ['key' => 'prioritySupport', 'enabled' => false],
            ['key' => 'smsNotifications', 'enabled' => true],
            ['key' => 'emailNotifications', 'enabled' => true],
            ['key' => 'workerApproval', 'enabled' => false],
        ];

        $privileges = \App\Models\Setting::get('privileges', $defaults);
        
        $config = [];
        foreach ($privileges as $priv) {
            $config[$priv['key']] = $priv['enabled'];
        }

        $systemMode = \App\Models\Setting::get('system_mode', 'live');
        $config['system_mode'] = $systemMode;

        return response()->json([
            'data' => [
                'privileges' => $config
            ]
        ]);
    }

    public function workerProfile($id): JsonResponse
    {
        $worker = User::with('pricingPlan')->where('role', 'worker')->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $worker->id,
                'name' => $worker->name,
                'avatar_url' => $worker->avatar_url,
                'cover_photo' => $worker->cover_photo,
                'verification' => $worker->verification,
                'district' => $worker->district,
                'pricing_plan' => $worker->pricingPlan,
                'pricing_plan_id' => $worker->pricing_plan_id,
                'status' => $worker->status,
            ]
        ]);
    }
}
