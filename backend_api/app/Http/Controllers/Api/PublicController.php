<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceCategory;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
use Throwable;

class PublicController extends Controller
{
    public function stats(): JsonResponse
    {
        if (! $this->requiredTablesExist(['users', 'service_categories', 'settings'])) {
            return response()->json([
                'customers' => 0,
                'workers' => 0,
                'categories' => 0,
            ]);
        }

        $stats = Cache::remember('public:stats', now()->addMinutes(10), function () {
            $workerApprovalEnabled = $this->workerApprovalEnabled();

            $customersCount = User::where('role', 'customer')->count();

            $workersQuery = User::where('role', 'worker')->where('status', 'Active');
            if ($workerApprovalEnabled) {
                $workersQuery->where('verification', 'Verified');
            } else {
                $workersQuery->where('verification', '!=', 'Rejected');
            }

            return [
                'customers' => $customersCount,
                'workers' => $workersQuery->count(),
                'categories' => ServiceCategory::count(),
            ];
        });

        return response()->json($stats);
    }

    public function config(): JsonResponse
    {
        $defaults = $this->defaultPrivileges();
        $privileges = Setting::get('privileges', $defaults);

        if (! is_array($privileges) || empty($privileges)) {
            $privileges = $defaults;
        }

        $config = [];
        foreach ($privileges as $priv) {
            if (is_array($priv) && isset($priv['key'])) {
                $config[$priv['key']] = (bool) ($priv['enabled'] ?? false);
            }
        }

        foreach ($defaults as $default) {
            $config[$default['key']] ??= (bool) $default['enabled'];
        }

        $config['system_mode'] = Setting::get('system_mode', 'live') ?: 'live';

        return response()->json([
            'data' => [
                'privileges' => $config,
            ],
        ]);
    }

    public function workerProfile(int $id): JsonResponse
    {
        if (! $this->requiredTablesExist(['users'])) {
            return response()->json([
                'message' => 'Database tables are not ready. Run php artisan migrate:fresh --seed.',
            ], 503);
        }

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
            ],
        ]);
    }

    private function workerApprovalEnabled(): bool
    {
        $privileges = Setting::get('privileges', []);

        if (! is_array($privileges)) {
            return false;
        }

        foreach ($privileges as $privilege) {
            if (is_array($privilege) && ($privilege['key'] ?? '') === 'workerApproval') {
                return (bool) ($privilege['enabled'] ?? false);
            }
        }

        return false;
    }

    private function defaultPrivileges(): array
    {
        return [
            ['key' => 'chat', 'enabled' => true],
            ['key' => 'bookings', 'enabled' => true],
            ['key' => 'featuredProfile', 'enabled' => false],
            ['key' => 'prioritySupport', 'enabled' => false],
            ['key' => 'smsNotifications', 'enabled' => true],
            ['key' => 'emailNotifications', 'enabled' => true],
            ['key' => 'workerApproval', 'enabled' => false],
        ];
    }

    private function requiredTablesExist(array $tables): bool
    {
        try {
            foreach ($tables as $table) {
                if (! Schema::hasTable($table)) {
                    return false;
                }
            }

            return true;
        } catch (Throwable $e) {
            return false;
        }
    }
}
