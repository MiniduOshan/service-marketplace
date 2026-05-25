<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('phone')->nullable()->unique()->after('email');
            $table->timestamp('phone_verified_at')->nullable()->after('email_verified_at');
            $table->string('phone_otp_hash')->nullable()->after('phone_verified_at');
            $table->timestamp('phone_otp_expires_at')->nullable()->after('phone_otp_hash');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropUnique(['phone']);
            $table->dropColumn(['phone', 'phone_verified_at', 'phone_otp_hash', 'phone_otp_expires_at']);
        });
    }
};