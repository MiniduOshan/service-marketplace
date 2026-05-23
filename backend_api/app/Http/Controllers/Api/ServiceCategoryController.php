<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceCategory;
use Illuminate\Http\JsonResponse;

class ServiceCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => ServiceCategory::query()
                ->where('is_active', true)
                ->withCount('servicePackages')
                ->orderBy('name')
                ->get(),
        ]);
    }
}