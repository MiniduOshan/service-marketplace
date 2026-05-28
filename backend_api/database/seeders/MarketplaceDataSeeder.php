<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ServiceCategory;
use App\Models\ServicePackage;
use App\Models\Booking;
use App\Models\BookingMessage;
use App\Models\Review;
use App\Models\Wallet;
use App\Models\Setting;
use App\Models\PricingPlan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MarketplaceDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Clear existing data to avoid duplication (excluding categories and pricing plans)
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        BookingMessage::truncate();
        Review::truncate();
        Booking::truncate();
        ServicePackage::truncate();
        Wallet::truncate();
        User::where('role', '!=', 'admin')->delete();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        // Ensure Admin user exists with correct credentials
        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL')],
            [
                'name' => 'SkilledLK Admin',
                'password' => Hash::make(env('ADMIN_PASSWORD')),
                'role' => 'admin',
            ]
        );

        // Fetch categories and pricing plans
        $categories = ServiceCategory::all();
        if ($categories->isEmpty()) {
            $this->call(ServiceCategorySeeder::class);
            $categories = ServiceCategory::all();
        }
        $plans = PricingPlan::all();

        // 2. Create Workers
        $workersData = [
            [
                'name' => 'Samantha Perera',
                'email' => 'samantha@skilledlk.com',
                'phone' => '0771234567',
                'category_slug' => 'painting',
                'city' => 'Colombo',
                'plan' => 'Starter',
                'services' => [
                    [
                        'title' => 'Residential Interior Painting',
                        'description' => 'Complete interior wall painting using premium quality washable paint. Includes wall preparation, putty application, and two coats of paint.',
                        'price' => 15000.00,
                        'duration' => 480,
                    ],
                    [
                        'title' => 'Exterior House Painting',
                        'description' => 'Weatherproof exterior wall painting with scaffolding setup and surface preparation. Anti-fungal protection included.',
                        'price' => 35000.00,
                        'duration' => 960,
                    ]
                ]
            ],
            [
                'name' => 'Nimal Silva',
                'email' => 'nimal@skilledlk.com',
                'phone' => '0772345678',
                'category_slug' => 'electrical',
                'city' => 'Kandy',
                'plan' => 'Pro',
                'services' => [
                    [
                        'title' => 'House Wiring & Troubleshooting',
                        'description' => 'Complete inspection, repair of short circuits, installation of new sockets, switches, and general electrical wiring checks.',
                        'price' => 4500.00,
                        'duration' => 120,
                    ],
                    [
                        'title' => 'CCTV Camera System Installation',
                        'description' => 'Installation of 4-channel or 8-channel CCTV security systems, configuration of DVR/NVR, and mobile app monitoring setup.',
                        'price' => 12000.00,
                        'duration' => 240,
                    ]
                ]
            ],
            [
                'name' => 'Ruwan Kumara',
                'email' => 'ruwan@skilledlk.com',
                'phone' => '0773456789',
                'category_slug' => 'plumbing',
                'city' => 'Galle',
                'plan' => 'Enterprise',
                'services' => [
                    [
                        'title' => 'Bathroom Pipeline Leak Repair',
                        'description' => 'Locating and repairing hidden pipeline leaks, replacement of faulty valves, taps, and fixing water pressure issues.',
                        'price' => 3500.00,
                        'duration' => 90,
                    ],
                    [
                        'title' => 'Complete Sanitary Ware Installation',
                        'description' => 'Installation of new commodes, washbasins, shower mixers, hot water geysers, and connecting to primary lines.',
                        'price' => 9500.00,
                        'duration' => 180,
                    ]
                ]
            ],
            [
                'name' => 'Kasun Jayawardena',
                'email' => 'kasun@skilledlk.com',
                'phone' => '0774567890',
                'category_slug' => 'ac-repair',
                'city' => 'Colombo',
                'plan' => 'Pro',
                'services' => [
                    [
                        'title' => 'Split AC Service & Chemical Clean',
                        'description' => 'Full cleaning of indoor and outdoor units, checking gas pressure, filter wash, and chemical treatment for maximum cooling efficiency.',
                        'price' => 5000.00,
                        'duration' => 60,
                    ]
                ]
            ]
        ];

        $workers = [];
        foreach ($workersData as $wData) {
            $cat = $categories->where('slug', $wData['category_slug'])->first();
            $plan = $plans->where('title', $wData['plan'])->first();

            $worker = new User();
            $worker->name = $wData['name'];
            $worker->email = $wData['email'];
            $worker->phone = $wData['phone'];
            $worker->password = Hash::make(env('SEED_DEFAULT_PASSWORD'));
            $worker->role = 'worker';
            $worker->primary_service_category_id = $cat ? $cat->id : null;
            $worker->pricing_plan_id = $plan ? $plan->id : null;
            $worker->status = 'Active';
            $worker->verification = 'Verified';
            $worker->phone_verified_at = now();
            $worker->save();

            // Create wallet for worker
            Wallet::create([
                'user_id' => $worker->id,
                'balance' => rand(5000, 35000),
            ]);

            $workers[] = [
                'model' => $worker,
                'services_info' => $wData['services'],
                'category_id' => $cat ? $cat->id : null
            ];
        }

        // 3. Create Service Packages
        $packages = [];
        foreach ($workers as $w) {
            $workerModel = $w['model'];
            foreach ($w['services_info'] as $sInfo) {
                $pkg = ServicePackage::create([
                    'user_id' => $workerModel->id,
                    'service_category_id' => $w['category_id'],
                    'title' => $sInfo['title'],
                    'slug' => Str::slug($sInfo['title'] . '-' . $workerModel->id),
                    'description' => $sInfo['description'],
                    'price' => $sInfo['price'],
                    'duration_minutes' => $sInfo['duration'],
                    'location_type' => 'onsite',
                    'is_active' => true,
                ]);
                $packages[] = $pkg;
            }
        }

        // 4. Create Customers
        $customersData = [
            [
                'name' => 'Amara Fernando',
                'email' => 'amara@example.com',
                'phone' => '0775678901',
            ],
            [
                'name' => 'Dilhani Herath',
                'email' => 'dilhani@example.com',
                'phone' => '0776789012',
            ],
            [
                'name' => 'Roshan Rodrigo',
                'email' => 'roshan@example.com',
                'phone' => '0777890123',
            ]
        ];

        $customers = [];
        foreach ($customersData as $cData) {
            $customer = new User();
            $customer->name = $cData['name'];
            $customer->email = $cData['email'];
            $customer->phone = $cData['phone'];
            $customer->password = Hash::make(env('SEED_DEFAULT_PASSWORD'));
            $customer->role = 'customer';
            $customer->status = 'Active';
            $customer->phone_verified_at = now();
            $customer->save();

            $customers[] = $customer;
        }

        // 5. Create Bookings in different states
        // Booking 1: Completed painting service package
        $p1 = $packages[0]; // Samantha's interior painting
        $b1 = Booking::create([
            'customer_id' => $customers[0]->id, // Amara
            'worker_id' => $p1->user_id,
            'service_package_id' => $p1->id,
            'scheduled_at' => now()->subDays(10),
            'address' => 'No. 45, Flower Road, Colombo 07',
            'notes' => 'Please bring floor protection covers.',
            'total_price' => $p1->price,
            'status' => 'completed',
        ]);

        // Review for completed Booking 1
        Review::create([
            'booking_id' => $b1->id,
            'customer_id' => $b1->customer_id,
            'worker_id' => $b1->worker_id,
            'rating' => 5,
            'comment' => 'Samantha did an amazing job painting our living room! The finish is extremely neat and they cleaned up everything afterwards. Highly recommended!',
        ]);

        // Booking 2: Accepted AC service
        $p2 = $packages[5] ?? $packages[count($packages) - 1]; // Kasun's Split AC service
        $b2 = Booking::create([
            'customer_id' => $customers[1]->id, // Dilhani
            'worker_id' => $p2->user_id,
            'service_package_id' => $p2->id,
            'scheduled_at' => now()->addDays(2),
            'address' => 'Apt 4B, Ocean View Towers, Colombo 03',
            'notes' => 'Unit is leaking water.',
            'total_price' => $p2->price,
            'status' => 'accepted',
        ]);

        // Booking 3: Pending plumbing service (active discussion)
        $p3 = $packages[2]; // Ruwan's leak repair
        $b3 = Booking::create([
            'customer_id' => $customers[0]->id, // Amara
            'worker_id' => $p3->user_id,
            'service_package_id' => $p3->id,
            'scheduled_at' => now()->addHours(18),
            'address' => 'No. 12, Galle Road, Galle',
            'notes' => 'Main pipeline leak under kitchen sink.',
            'total_price' => $p3->price,
            'status' => 'pending',
        ]);

        // Chat messages for Booking 3 (Ruwan and Amara)
        BookingMessage::create([
            'booking_id' => $b3->id,
            'sender_id' => $customers[0]->id,
            'body' => 'Hi Ruwan, the leak under the sink seems to be getting worse. Can you come early tomorrow morning?',
            'created_at' => now()->subHours(2),
        ]);

        BookingMessage::create([
            'booking_id' => $b3->id,
            'sender_id' => $p3->user_id,
            'body' => 'Hi Amara, yes I can make it by 9:00 AM. Please make sure to close the main water valve if it starts flooding.',
            'created_at' => now()->subHours(1),
        ]);

        BookingMessage::create([
            'booking_id' => $b3->id,
            'sender_id' => $customers[0]->id,
            'body' => 'Thanks, I have closed the valve for now. See you tomorrow at 9!',
            'created_at' => now()->subMinutes(30),
        ]);

        // Booking 4: Cancelled booking
        $b4 = Booking::create([
            'customer_id' => $customers[2]->id, // Roshan
            'worker_id' => $packages[1]->user_id, // Samantha's exterior painting
            'service_package_id' => $packages[1]->id,
            'scheduled_at' => now()->subDays(5),
            'address' => 'No. 88, Temple Road, Colombo 10',
            'notes' => 'Please paint exterior boundary wall.',
            'total_price' => $packages[1]->price,
            'status' => 'cancelled',
        ]);

        // 6. Seed Setting defaults and Notification logs
        $logs = [
            [
                'channel' => 'sms',
                'audience' => 'all',
                'subject' => null,
                'message' => 'SkilledLK Platform Update: We have introduced new security options for both customers and workers. Please update your profiles.',
                'timestamp' => now()->subDays(2)->toIso8601String(),
            ],
            [
                'channel' => 'email',
                'audience' => 'workers',
                'subject' => 'New Premium Pricing Plans Active',
                'message' => 'Dear Partner, new subscription features are now live. You can subscribe to Pro/Enterprise plans to get priority support and featured badges.',
                'timestamp' => now()->subDay()->toIso8601String(),
            ]
        ];
        Setting::set('notification_logs', $logs);

        $privileges = [
            ['key' => 'chat', 'label' => 'Chat access', 'description' => 'Allow workers and customers to message each other.', 'enabled' => true],
            ['key' => 'bookings', 'label' => 'Booking access', 'description' => 'Enable booking scheduling and workflow.', 'enabled' => true],
            ['key' => 'featuredProfile', 'label' => 'Featured profile', 'description' => 'Highlight top rated workers.', 'enabled' => true],
            ['key' => 'prioritySupport', 'label' => 'Priority support', 'description' => 'Show dedicated help lines to premium plans.', 'enabled' => true],
            ['key' => 'smsNotifications', 'label' => 'SMS notifications', 'description' => 'Send real-time alerts to phones.', 'enabled' => true],
            ['key' => 'emailNotifications', 'label' => 'Email notifications', 'description' => 'Send summaries and statements.', 'enabled' => true],
        ];
        Setting::set('privileges', $privileges);
    }
}
