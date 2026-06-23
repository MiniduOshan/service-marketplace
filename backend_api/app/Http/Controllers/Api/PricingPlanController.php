<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PricingPlan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class PricingPlanController extends Controller
{
    public function publicIndex(): JsonResponse
    {
        return response()->json([
            'data' => PricingPlan::query()->where('is_active', true)->orderBy('price')->get(),
        ]);
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'data' => PricingPlan::query()->latest()->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'price' => ['required', 'numeric', 'min:0'],
            'billing_cycle' => ['required', 'string', 'max:50'],
            'status' => ['required', 'string', 'max:50'],
            'privileges' => ['nullable', 'array'],
            'privileges.*' => ['string', 'max:100'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $pricingPlan = PricingPlan::create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']).'-'.Str::lower(Str::random(6)),
            'description' => $validated['description'] ?? 'System pricing plan offered to users.',
            'price' => $validated['price'],
            'billing_cycle' => $validated['billing_cycle'],
            'status' => $validated['status'],
            'privileges' => array_values($validated['privileges'] ?? []),
            'is_active' => $validated['is_active'] ?? true,
        ]);

        Cache::forever('services:list:version', (string) microtime(true));

        return response()->json([
            'message' => 'Pricing plan created successfully.',
            'data' => $pricingPlan,
        ], 201);
    }

    public function update(Request $request, PricingPlan $pricingPlan): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'billing_cycle' => ['sometimes', 'string', 'max:50'],
            'status' => ['sometimes', 'string', 'max:50'],
            'privileges' => ['sometimes', 'array'],
            'privileges.*' => ['string', 'max:100'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if (array_key_exists('title', $validated)) {
            $validated['slug'] = Str::slug($validated['title']).'-'.Str::lower(Str::random(6));
        }

        if (array_key_exists('privileges', $validated)) {
            $validated['privileges'] = array_values($validated['privileges'] ?? []);
        }

        $pricingPlan->update($validated);

        Cache::forever('services:list:version', (string) microtime(true));

        return response()->json([
            'message' => 'Pricing plan updated successfully.',
            'data' => $pricingPlan->fresh(),
        ]);
    }

    public function destroy(PricingPlan $pricingPlan): JsonResponse
    {
        $pricingPlan->delete();

        Cache::forever('services:list:version', (string) microtime(true));

        return response()->json([
            'message' => 'Pricing plan deleted successfully.',
        ]);
    }
}