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
            $customersCount = User::where('role', 'customer')->count();
            $workersCount = User::where('role', 'worker')->where('status', 'Active')->count();
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
        ];

        $privileges = \App\Models\Setting::get('privileges', $defaults);
        
        $config = [];
        foreach ($privileges as $priv) {
            $config[$priv['key']] = $priv['enabled'];
        }

        return response()->json([
            'data' => [
                'privileges' => $config
            ]
        ]);
    }
}
