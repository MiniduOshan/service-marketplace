<?php

use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\BookingMessageController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PricingPlanController;
use App\Http\Controllers\Api\ServiceCategoryController;
use App\Http\Controllers\Api\ServicePackageController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Middleware\AuthenticateApiToken;
use App\Http\Middleware\EnsureUserRole;
use Illuminate\Support\Facades\Route;

$registerRoutes = function () {
    Route::get('/health', function () {
        return response()->json([
            'status' => 'ok',
            'message' => 'Service Marketplace API is running.',
        ]);
    });

    Route::get('/public-stats', [\App\Http\Controllers\Api\PublicController::class, 'stats']);
    Route::get('/platform-config', [\App\Http\Controllers\Api\PublicController::class, 'config']);
    Route::get('/workers/{workerId}/profile', [\App\Http\Controllers\Api\PublicController::class, 'workerProfile']);
    
    Route::get('/categories', [ServiceCategoryController::class, 'index']);
    Route::get('/services', [ServicePackageController::class, 'index']);
    Route::get('/services/{servicePackage}', [ServicePackageController::class, 'show']);
    Route::get('/workers/{workerId}/reviews', [ReviewController::class, 'index']);
    Route::get('/pricing-plans', [PricingPlanController::class, 'publicIndex']);

    Route::prefix('auth')->group(function () {
        Route::middleware('throttle:auth')->group(function () {
            Route::post('/register', [AuthController::class, 'register']);
            Route::post('/register-worker', [AuthController::class, 'registerWorker']);
            Route::post('/login', [AuthController::class, 'login']);
            Route::post('/google', [AuthController::class, 'google']);
            Route::post('/phone/request-otp', [AuthController::class, 'requestPhoneOtp']);
            Route::post('/phone/verify-otp', [AuthController::class, 'verifyPhoneOtp']);
            Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
            Route::post('/reset-password', [AuthController::class, 'resetPassword']);
        });

        Route::middleware(AuthenticateApiToken::class)->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::post('/user/request-phone-otp', [AuthController::class, 'requestUserPhoneOtp']);
            Route::post('/user/verify-phone-otp', [AuthController::class, 'verifyUserPhoneOtp']);
            Route::post('/profile', [AuthController::class, 'updateProfile']);
            Route::post('/user/pricing-plan', [AuthController::class, 'updatePricingPlan']);
            Route::get('/customer/stats', [AuthController::class, 'customerStats']);

            Route::get('/bookings', [BookingController::class, 'index']);
            Route::post('/bookings', [BookingController::class, 'store']);
            Route::patch('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);
            Route::post('/bookings/{booking}/refund-request', [BookingController::class, 'refundRequest']);
            Route::patch('/bookings/{booking}/decline', [BookingController::class, 'decline']);
            Route::patch('/bookings/{booking}/accept', [BookingController::class, 'accept']);
            Route::patch('/bookings/{booking}/complete', [BookingController::class, 'complete']);
            Route::patch('/bookings/{booking}/settle', [BookingController::class, 'settle']);
            Route::patch('/bookings/{booking}/schedule', [BookingController::class, 'updateSchedule']);
            Route::get('/bookings/{booking}/messages', [BookingMessageController::class, 'index']);
            Route::post('/bookings/{booking}/messages', [BookingMessageController::class, 'store']);
            Route::post('/bookings/{booking}/reviews', [ReviewController::class, 'store']);
            
            Route::get('/notifications', [NotificationController::class, 'index']);
            Route::post('/notifications/mark-read', [NotificationController::class, 'markAllRead']);

            Route::middleware(EnsureUserRole::class.':worker')->group(function () {
                Route::get('/worker/services', [ServicePackageController::class, 'workerServices']);
                Route::get('/worker/stats', [AuthController::class, 'workerStats']);
                Route::post('/worker/services', [ServicePackageController::class, 'store']);
                Route::patch('/worker/services/{servicePackage}', [ServicePackageController::class, 'update']);
                Route::delete('/worker/services/{servicePackage}', [ServicePackageController::class, 'destroy']);
            });
        });
    });

    Route::middleware(AuthenticateApiToken::class)->group(function () {
        Route::middleware(EnsureUserRole::class.':admin')->group(function () {
            Route::get('/admin/pricing-plans', [PricingPlanController::class, 'index']);
            Route::post('/admin/pricing-plans', [PricingPlanController::class, 'store']);
            Route::patch('/admin/pricing-plans/{pricingPlan}', [PricingPlanController::class, 'update']);
            Route::delete('/admin/pricing-plans/{pricingPlan}', [PricingPlanController::class, 'destroy']);
            
            Route::get('/admin/workers', [AdminController::class, 'workers']);
            Route::patch('/admin/workers/{id}', [AdminController::class, 'updateWorker']);
            Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
            Route::get('/admin/stats', [AdminController::class, 'dashboardStats']);
            Route::get('/admin/customers', [AdminController::class, 'customers']);
            Route::patch('/admin/customers/{id}', [AdminController::class, 'updateCustomer']);
            Route::get('/admin/privileges', [AdminController::class, 'privileges']);
            Route::post('/admin/privileges/{key}/toggle', [AdminController::class, 'togglePrivilege']);
            Route::post('/admin/system/mode', [AdminController::class, 'setSystemMode']);
            Route::get('/admin/system/health', [AdminController::class, 'systemHealth']);
            Route::post('/admin/notifications/send', [AdminController::class, 'sendNotification']);
            Route::post('/admin/credentials', [AdminController::class, 'saveCredentials']);
            Route::patch('/admin/users/{id}/pricing-plan', [AdminController::class, 'assignPricingPlan']);
            
            Route::get('/admin/categories', [ServiceCategoryController::class, 'adminIndex']);
            Route::post('/admin/categories', [ServiceCategoryController::class, 'store']);
            Route::patch('/admin/categories/{serviceCategory}', [ServiceCategoryController::class, 'update']);
            Route::delete('/admin/categories/{serviceCategory}', [ServiceCategoryController::class, 'destroy']);

            Route::get('/admin/refunds', [AdminController::class, 'listRefunds']);
            Route::post('/admin/refunds/{payment}/approve', [AdminController::class, 'approveRefund']);
            Route::post('/admin/refunds/{payment}/reject', [AdminController::class, 'rejectRefund']);
        });
    });
};

Route::prefix('v1')->middleware('throttle:api')->group($registerRoutes);
Route::middleware('throttle:api')->group($registerRoutes);