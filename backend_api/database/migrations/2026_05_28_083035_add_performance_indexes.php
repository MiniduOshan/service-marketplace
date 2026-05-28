<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->index(['worker_id', 'rating']);
        });

        Schema::table('service_packages', function (Blueprint $table) {
            $table->index(['is_active', 'created_at']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->index('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
        });

        Schema::table('service_packages', function (Blueprint $table) {
            $table->dropIndex(['is_active', 'created_at']);
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropIndex(['worker_id', 'rating']);
        });
    }
};
