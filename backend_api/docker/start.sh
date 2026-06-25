#!/usr/bin/env bash

# Cache configuration
php -d memory_limit=256M artisan config:cache
php -d memory_limit=256M artisan route:cache
php -d memory_limit=256M artisan view:cache

# Run database migrations
php -d memory_limit=256M artisan migrate --force

# Start Supervisor (which starts Nginx and PHP-FPM)
/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
