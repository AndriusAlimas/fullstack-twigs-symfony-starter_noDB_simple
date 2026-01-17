#!/bin/sh

# Check if vendor directory exists, if not install dependencies
if [ ! -d "vendor" ]; then
    echo "Installing Composer dependencies..."
    composer install --optimize-autoloader --no-interaction
fi

# Start PHP-FPM
php-fpm -D

# Start Nginx
nginx -g "daemon off;"