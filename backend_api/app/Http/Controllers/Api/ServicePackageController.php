<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServicePackage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServicePackageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ServicePackage::query()
            ->with([
                'category',
                'worker' => function ($q) {
                    $q->select('id', 'name', 'role', 'primary_service_category_id', 'phone_verified_at')
                      ->withAvg('workerReviews as average_rating', 'rating')
                      ->withCount('workerReviews as reviews_count');
                }
            ])
            ->where('is_active', true)
            ->latest();

        if ($request->filled('category')) {
            $query->whereHas('category', function ($categoryQuery) use ($request): void {
                $categoryQuery->where('slug', (string) $request->input('category'));
            });
        }

        if ($request->filled('worker_id')) {
            $query->where('user_id', $request->input('worker_id'));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));

            $query->where(function ($serviceQuery) use ($search): void {
                $serviceQuery->where('title', 'like', '%'.$search.'%')
                    ->orWhere('description', 'like', '%'.$search.'%')
                    ->orWhereHas('worker', function ($workerQuery) use ($search): void {
                        $workerQuery->where('name', 'like', '%'.$search.'%');
                    });
            });
        }

        return response()->json([
            'data' => $query->paginate(12),
        ]);
    }

    public function show(ServicePackage $servicePackage): JsonResponse
    {
        return response()->json([
            'data' => $servicePackage->load([
                'category',
                'worker' => function ($q) {
                    $q->select('id', 'name', 'role', 'primary_service_category_id', 'phone_verified_at')
                      ->withAvg('workerReviews as average_rating', 'rating')
                      ->withCount('workerReviews as reviews_count');
                }
            ]),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        abort_unless($user?->isWorker(), 403, 'Only workers can create service packages.');

        $validated = $request->validate([
            'service_category_id' => ['required', 'exists:service_categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'duration_minutes' => ['nullable', 'integer', 'min:15'],
            'location_type' => ['nullable', 'string', 'max:50'],
        ]);

        $servicePackage = ServicePackage::create([
            'user_id' => $user->id,
            'service_category_id' => $validated['service_category_id'],
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']).'-'.Str::lower(Str::random(6)),
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'duration_minutes' => $validated['duration_minutes'] ?? null,
            'location_type' => $validated['location_type'] ?? 'onsite',
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Service package created successfully.',
            'data' => $servicePackage->load(['category', 'worker']),
        ], 201);
    }

    public function update(Request $request, ServicePackage $servicePackage): JsonResponse
    {
        $user = $request->user();

        abort_unless($user?->id === $servicePackage->user_id, 403, 'You can only edit your own service packages.');

        $validated = $request->validate([
            'service_category_id' => ['sometimes', 'exists:service_categories,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'duration_minutes' => ['sometimes', 'nullable', 'integer', 'min:15'],
            'location_type' => ['sometimes', 'nullable', 'string', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if (array_key_exists('title', $validated)) {
            $validated['slug'] = Str::slug($validated['title']).'-'.Str::lower(Str::random(6));
        }

        $servicePackage->update($validated);

        return response()->json([
            'message' => 'Service package updated successfully.',
            'data' => $servicePackage->fresh()->load(['category', 'worker']),
        ]);
    }

    public function workerServices(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $services = ServicePackage::query()
            ->with(['category'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'data' => $services,
        ]);
    }
}