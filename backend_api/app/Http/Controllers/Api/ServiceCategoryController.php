<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Throwable;

class ServiceCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        if (! $this->serviceCategoriesTableExists()) {
            return response()->json(['data' => []]);
        }

        $categories = Cache::remember('categories:active', now()->addDay(), function () {
            return ServiceCategory::query()
                ->where('is_active', true)
                ->withCount('servicePackages')
                ->orderBy('name')
                ->get();
        });

        return response()->json([
            'data' => $categories,
        ]);
    }

    public function adminIndex(): JsonResponse
    {
        if (! $this->serviceCategoriesTableExists()) {
            return response()->json(['data' => []]);
        }

        $categories = ServiceCategory::query()
            ->withCount('servicePackages')
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => $categories,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:service_categories,name'],
            'description' => ['nullable', 'string', 'max:1000'],
            'icon' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $slug = Str::slug($validated['name']);
        if (ServiceCategory::where('slug', $slug)->exists()) {
            $slug .= '-' . Str::lower(Str::random(4));
        }

        $category = ServiceCategory::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'icon' => $validated['icon'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        Cache::forget('categories:active');

        return response()->json([
            'message' => 'Category created successfully.',
            'data' => $category,
        ], 201);
    }

    public function update(Request $request, ServiceCategory $serviceCategory): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255', 'unique:service_categories,name,'.$serviceCategory->id],
            'description' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'icon' => ['sometimes', 'nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'required', 'boolean'],
        ]);

        if (isset($validated['name'])) {
            $slug = Str::slug($validated['name']);
            if (ServiceCategory::where('slug', $slug)->where('id', '!=', $serviceCategory->id)->exists()) {
                $slug .= '-' . Str::lower(Str::random(4));
            }
            $validated['slug'] = $slug;
        }

        $serviceCategory->update($validated);

        Cache::forget('categories:active');

        return response()->json([
            'message' => 'Category updated successfully.',
            'data' => $serviceCategory->fresh(),
        ]);
    }

    public function destroy(ServiceCategory $serviceCategory): JsonResponse
    {
        if ($serviceCategory->servicePackages()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category that has service packages.',
            ], 422);
        }

        $serviceCategory->delete();

        Cache::forget('categories:active');

        return response()->json([
            'message' => 'Category deleted successfully.',
        ]);
    }

    private function serviceCategoriesTableExists(): bool
    {
        try {
            return Schema::hasTable('service_categories');
        } catch (Throwable $e) {
            return false;
        }
    }
}
