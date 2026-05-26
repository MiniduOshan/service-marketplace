<?php

namespace Database\Seeders;

use App\Models\ServiceCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServiceCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Painting',
            'Electrical',
            'Plumbing',
            'Carpentry',
            'AC Repair',
            'Cleaning',
            'Masonry',
            'Gardening',
            'Appliance Repair',
            'Pest Control',
            'Auto Repair',
            'Car Detailing',
            'Tech Support',
            'Graphic Design',
            'Photography',
            'Catering',
            'Personal Training',
            'Academic Tutoring',
            'Moving & Packing',
            'Translation',
        ];

        foreach ($categories as $category) {
            ServiceCategory::updateOrCreate(
                ['slug' => Str::slug($category)],
                ['name' => $category, 'description' => $category.' services', 'is_active' => true]
            );
        }
    }
}