<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pricing_plans', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('billing_cycle')->default('Monthly');
            $table->string('status')->default('Active');
            $table->json('privileges')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        DB::table('pricing_plans')->insert([
            [
                'title' => 'Starter',
                'slug' => 'starter-plan',
                'description' => 'Entry system plan for new users.',
                'price' => 2500.00,
                'billing_cycle' => 'Monthly',
                'status' => 'Active',
                'privileges' => json_encode(['chat', 'bookings']),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Pro',
                'slug' => 'pro-plan',
                'description' => 'Best value plan for active users.',
                'price' => 5500.00,
                'billing_cycle' => 'Monthly',
                'status' => 'Popular',
                'privileges' => json_encode(['chat', 'bookings', 'featuredProfile', 'smsNotifications']),
                'is_active' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Enterprise',
                'slug' => 'enterprise-plan',
                'description' => 'Advanced plan with priority support.',
                'price' => 12000.00,
                'billing_cycle' => 'Monthly',
                'status' => 'Premium',
                'privileges' => json_encode(['chat', 'bookings', 'featuredProfile', 'prioritySupport', 'smsNotifications', 'emailNotifications']),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('pricing_plans');
    }
};