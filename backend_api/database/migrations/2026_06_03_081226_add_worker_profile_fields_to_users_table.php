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
        Schema::table('users', function (Blueprint $table) {
            $table->text('bio')->nullable()->after('primary_service_category_id');
            $table->string('city')->nullable()->after('bio');
            $table->json('skills')->nullable()->after('city');
            $table->string('avatar_url', 2048)->nullable()->after('skills');
            $table->string('nic_front', 2048)->nullable()->after('avatar_url');
            $table->string('nic_back', 2048)->nullable()->after('nic_front');
            $table->json('certificates')->nullable()->after('nic_back');
            $table->string('police_clearance', 2048)->nullable()->after('certificates');
            $table->json('portfolio')->nullable()->after('police_clearance');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'bio',
                'city',
                'skills',
                'avatar_url',
                'nic_front',
                'nic_back',
                'certificates',
                'police_clearance',
                'portfolio',
            ]);
        });
    }
};
