#!/usr/bin/env bash

# Cache configuration
php -d memory_limit=512M artisan config:cache
php -d memory_limit=512M artisan route:cache
php -d memory_limit=512M artisan view:cache

# Run database migrations
php -d memory_limit=512M artisan migrate --force

# Start Supervisor (which starts Nginx and PHP-FPM)
/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
