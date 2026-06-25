<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSystemMode
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $mode = \App\Models\Setting::get('system_mode', 'live');

        if ($mode === 'maintenance') {
            if ($this->isAllowedDuringMaintenance($request)) {
                return $next($request);
            }

            // This is kept as a fallback for any guard-authenticated admin requests.
            if ($request->user() && $request->user()->role === 'admin') {
                return $next($request);
            }

            return response()->json([
                'message' => 'System is currently under maintenance.',
                'code' => 'MAINTENANCE_MODE',
            ], 503);
        }

        return $next($request);
    }

    private function isAllowedDuringMaintenance(Request $request): bool
    {
        $allowedPatterns = [
            'api/health',
            'api/v1/health',
            'api/platform-config',
            'api/v1/platform-config',
            'api/auth/login',
            'api/v1/auth/login',
            'api/auth/me',
            'api/v1/auth/me',
            'api/auth/logout',
            'api/v1/auth/logout',
            'api/auth/forgot-password',
            'api/v1/auth/forgot-password',
            'api/auth/reset-password',
            'api/v1/auth/reset-password',
            'api/admin/*',
            'api/v1/admin/*',
        ];

        foreach ($allowedPatterns as $pattern) {
            if ($request->is($pattern)) {
                return true;
            }
        }

        return false;
    }
}
