<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServicePackage;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class ServicePackageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page = $request->input('page', 1);
        $category = $request->input('category');
        $workerId = $request->input('worker_id');
        $search = $request->input('search');
        $district = $request->input('district');

        if ($request->filled('worker_id')) {
            User::whereKey($request->input('worker_id'))->increment('profile_views');
        }

        $version = Cache::rememberForever('services:list:version', fn() => (string) microtime(true));
        $cacheKey = "services:list:{$version}:" . md5(serialize([$page, $category, $workerId, $search, $district]));

        $data = Cache::remember($cacheKey, now()->addMinutes(2), function () use ($request) {
            $query = ServicePackage::query()
                ->with([
                    'category',
                    'worker' => function ($q) {
                        $q->select('id', 'name', 'role', 'primary_service_category_id', 'phone_verified_at', 'pricing_plan_id', 'verification', 'avatar_url', 'cover_photo', 'district')
                          ->withAvg('workerReviews as average_rating', 'rating')
                          ->withCount('workerReviews as reviews_count')
                          ->withCount(['workerBookings as completed_jobs_count' => function ($query) {
                              $query->where('status', 'completed');
                          }])
                          ->with('pricingPlan');
                    }
                ])
                ->whereHas('worker', function ($q) {
                    $q->where('verification', '!=', 'Rejected')
                      ->where('status', 'Active')
                      ->where(function ($planQuery) {
                          $planQuery->whereNull('pricing_plan_id')
                                    ->orWhereHas('pricingPlan', function ($subQuery) {
                                        $subQuery->where('is_active', true);
                                    });
                      });
                })
                ->where('is_active', true)
                ->orderBy(
                    User::selectRaw('COALESCE(pricing_plans.price, 0)')
                        ->leftJoin('pricing_plans', 'pricing_plans.id', '=', 'users.pricing_plan_id')
                        ->whereColumn('users.id', 'service_packages.user_id')
                        ->limit(1),
                    'desc'
                )
                ->orderBy(
                    \App\Models\Review::selectRaw('COALESCE(AVG(rating), 0)')
                        ->whereColumn('reviews.worker_id', 'service_packages.user_id')
                        ->limit(1),
                    'desc'
                )
                ->orderByRaw('(SELECT CASE WHEN verification = "Verified" THEN 1 ELSE 0 END FROM users WHERE users.id = service_packages.user_id) DESC')
                ->latest('service_packages.created_at');

            if ($request->filled('category')) {
                $query->whereHas('category', function ($categoryQuery) use ($request): void {
                    $categoryQuery->where('slug', (string) $request->input('category'));
                });
            }

            if ($request->filled('district')) {
                $query->whereHas('worker', function ($workerQuery) use ($request): void {
                    $workerQuery->where('district', (string) $request->input('district'));
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

            return $query->paginate(12)->toArray();
        });

        return response()->json([
            'data' => $data,
        ]);
    }

    public function show(ServicePackage $servicePackage): JsonResponse
    {
        if ($servicePackage->user_id) {
            User::whereKey($servicePackage->user_id)->increment('profile_views');
        }

        $data = Cache::remember("service_package:{$servicePackage->id}", now()->addDay(), function () use ($servicePackage) {
            return $servicePackage->load([
                'category',
                'worker' => function ($q) {
                    $q->select('id', 'name', 'role', 'primary_service_category_id', 'phone_verified_at', 'pricing_plan_id', 'verification', 'avatar_url', 'cover_photo')
                      ->withAvg('workerReviews as average_rating', 'rating')
                      ->withCount('workerReviews as reviews_count')
                      ->withCount(['workerBookings as completed_jobs_count' => function ($query) {
                          $query->where('status', 'completed');
                      }])
                      ->with('pricingPlan');
                }
            ])->toArray();
        });

        return response()->json([
            'data' => $data,
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
            'image_url' => ['nullable', 'string', 'max:2048'],
        ]);

        if (isset($validated['image_url'])) {
            $error = $this->validateImageUrl($validated['image_url']);
            if ($error) {
                return response()->json(['message' => $error], 422);
            }
        }

        $servicePackage = ServicePackage::create([
            'user_id' => $user->id,
            'service_category_id' => $validated['service_category_id'],
            'title' => strip_tags($validated['title']),
            'slug' => Str::slug(strip_tags($validated['title'])).'-'.Str::lower(Str::random(6)),
            'description' => isset($validated['description']) ? strip_tags($validated['description']) : null,
            'price' => $validated['price'],
            'duration_minutes' => $validated['duration_minutes'] ?? null,
            'location_type' => $validated['location_type'] ?? 'onsite',
            'image_url' => $validated['image_url'] ?? null,
            'is_active' => true,
        ]);

        Cache::forever('services:list:version', (string) microtime(true));
        Cache::forget('categories:active');

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
            'image_url' => ['sometimes', 'nullable', 'string', 'max:2048'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if (isset($validated['image_url'])) {
            $error = $this->validateImageUrl($validated['image_url']);
            if ($error) {
                return response()->json(['message' => $error], 422);
            }
        }

        if (array_key_exists('title', $validated)) {
            $validated['title'] = strip_tags($validated['title']);
            $validated['slug'] = Str::slug($validated['title']).'-'.Str::lower(Str::random(6));
        }

        if (array_key_exists('description', $validated) && $validated['description'] !== null) {
            $validated['description'] = strip_tags($validated['description']);
        }

        $servicePackage->update($validated);

        Cache::forget("service_package:{$servicePackage->id}");
        Cache::forever('services:list:version', (string) microtime(true));
        Cache::forget('categories:active');

        return response()->json([
            'message' => 'Service package updated successfully.',
            'data' => $servicePackage->fresh()->load(['category', 'worker']),
        ]);
    }

    public function destroy(ServicePackage $servicePackage): JsonResponse
    {
        $user = request()->user();
        abort_unless($user?->id === $servicePackage->user_id, 403, 'You can only delete your own service packages.');

        $servicePackage->delete();

        Cache::forget("service_package:{$servicePackage->id}");
        Cache::forever('services:list:version', (string) microtime(true));
        Cache::forget('categories:active');

        return response()->json([
            'message' => 'Service package deleted successfully.',
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

    private function validateImageUrl(?string $imageUrl): ?string
    {
        if (!$imageUrl) {
            return null;
        }

        if (!filter_var($imageUrl, FILTER_VALIDATE_URL)) {
            return 'Invalid image URL format.';
        }

        $supabaseUrl = env('SUPABASE_URL') ?: 'https://jaqwysogwxwkpykcmpjq.supabase.co';
        if ($supabaseUrl) {
            $supabaseHost = strtolower(parse_url($supabaseUrl, PHP_URL_HOST));
            $imageHost = strtolower(parse_url($imageUrl, PHP_URL_HOST));
            if ($supabaseHost && $imageHost && $supabaseHost !== $imageHost) {
                if (!(str_ends_with($supabaseHost, 'supabase.co') && str_ends_with($imageHost, 'supabase.co'))) {
                    return 'Image must be hosted on the approved storage provider.';
                }
            }
        }

        $path = parse_url($imageUrl, PHP_URL_PATH);
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        if (!in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
            return 'Only JPG, JPEG, PNG, GIF, and WEBP images are allowed.';
        }

        try {
            $response = \Illuminate\Support\Facades\Http::timeout(3)->head($imageUrl);
            if ($response->successful()) {
                $contentLength = $response->header('Content-Length');
                if ($contentLength && $contentLength > 5 * 1024 * 1024) {
                    return 'The image size exceeds the 5MB limit.';
                }
            }
        } catch (\Exception $e) {
            // Keep it permissive on connection/network issues, but restrict if test specifies
        }

        return null;
    }
}