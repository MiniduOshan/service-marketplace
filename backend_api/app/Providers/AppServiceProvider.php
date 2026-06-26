<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(300)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        /*
         * IMPORTANT FIX:
         * The old code listened for ConnectionEstablished and then executed
         * another database query inside that listener. On this project it caused
         * repeated reconnection/ConnectionEstablished events and exhausted PHP
         * memory during migrate, seed, and even /api/v1/health.
         *
         * max_allowed_packet should be configured in MySQL/MariaDB, not inside
         * Laravel's connection-established event.
         */
    }
}
