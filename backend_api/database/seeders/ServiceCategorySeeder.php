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
        ];

        foreach ($categories as $category) {
            ServiceCategory::updateOrCreate(
                ['slug' => Str::slug($category)],
                ['name' => $category, 'description' => $category.' services', 'is_active' => true]
            );
        }
    }
}