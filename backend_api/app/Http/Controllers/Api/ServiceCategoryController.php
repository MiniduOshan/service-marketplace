<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class ServiceCategoryController extends Controller
{
    public function index(): JsonResponse
    {
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
}