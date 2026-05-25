<?php

use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ServiceCategoryController;
use App\Http\Controllers\Api\ServicePackageController;
use App\Http\Middleware\AuthenticateApiToken;
use App\Http\Middleware\EnsureUserRole;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Service Marketplace API is running.',
    ]);
});

Route::get('/categories', [ServiceCategoryController::class, 'index']);
Route::get('/services', [ServicePackageController::class, 'index']);
Route::get('/services/{servicePackage}', [ServicePackageController::class, 'show']);

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/register-worker', [AuthController::class, 'registerWorker']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/google', [AuthController::class, 'google']);
    Route::post('/phone/request-otp', [AuthController::class, 'requestPhoneOtp']);
    Route::post('/phone/verify-otp', [AuthController::class, 'verifyPhoneOtp']);

    Route::middleware(AuthenticateApiToken::class)->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/bookings', [BookingController::class, 'index']);
        Route::post('/bookings', [BookingController::class, 'store']);
        Route::patch('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);

        Route::middleware(EnsureUserRole::class.':worker')->group(function () {
            Route::post('/worker/services', [ServicePackageController::class, 'store']);
            Route::patch('/worker/services/{servicePackage}', [ServicePackageController::class, 'update']);
        });
    });
});