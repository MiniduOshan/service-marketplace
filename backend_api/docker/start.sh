#!/usr/bin/env bash

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
php artisan migrate --force

# Start Supervisor (which starts Nginx and PHP-FPM)
/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
