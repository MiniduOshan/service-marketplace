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
            // Allow admin routes
            if ($request->is('api/v1/admin/*') || $request->is('api/v1/platform-config')) {
                return $next($request);
            }
            
            // Allow authenticated admin users
            if ($request->user() && $request->user()->role === 'admin') {
                return $next($request);
            }

            // Exclude auth routes for admin to login
            if ($request->is('api/v1/login') || $request->is('api/v1/auth/me')) {
                return $next($request);
            }
            
            return response()->json([
                'message' => 'System is currently under maintenance.',
                'code' => 'MAINTENANCE_MODE'
            ], 503);
        }

        return $next($request);
    }
}
