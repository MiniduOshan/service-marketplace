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

        \Illuminate\Support\Facades\Event::listen(
            \Illuminate\Database\Events\ConnectionEstablished::class,
            function ($event) {
                try {
                    if ($event->connection->getDriverName() === 'mysql') {
                        $maxPacket = $event->connection->select("SHOW VARIABLES LIKE 'max_allowed_packet'");
                        if (!empty($maxPacket) && intval($maxPacket[0]->Value) < 67108864) {
                            $event->connection->statement("SET GLOBAL max_allowed_packet = 67108864");
                        }
                    }
                } catch (\Exception $e) {
                    // Fail silently if lacks privileges or if table isn't fully set up yet
                }
            }
        );
    }
}
