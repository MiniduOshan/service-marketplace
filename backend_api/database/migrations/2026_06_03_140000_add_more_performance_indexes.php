<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->index(['role', 'status'], 'users_role_status_index');
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->index('status', 'bookings_status_index');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex('bookings_status_index');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('users_role_status_index');
        });
    }
};
