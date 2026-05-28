<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('payment_option')->default('after')->after('total_price');
            $table->decimal('advance_paid', 10, 2)->default(0.00)->after('payment_option');
            $table->string('payout_status')->default('pending')->after('advance_paid');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['payment_option', 'advance_paid', 'payout_status']);
        });
    }
};
