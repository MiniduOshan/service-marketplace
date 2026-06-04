<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Create a completely new user
$user = App\Models\User::create([
    'name' => 'Test User',
    'email' => 'test@example.com',
    'phone' => '1234567890',
    'password' => 'password',
    'role' => 'worker',
    'pricing_plan_id' => 3
]);

$token = $user->issueApiToken();
echo "Token: $token\n";

// Test /auth/me
$request = Illuminate\Http\Request::create('/api/v1/auth/me', 'GET');
$request->headers->set('Authorization', 'Bearer ' . $token);
$response = app()->handle($request);
echo "/auth/me STATUS: " . $response->getStatusCode() . "\n";

// Test /auth/user/pricing-plan with null
$request = Illuminate\Http\Request::create(
    '/api/v1/auth/user/pricing-plan',
    'POST',
    [], [], [],
    ['CONTENT_TYPE' => 'application/json'],
    json_encode(['pricing_plan_id' => null])
);
$request->headers->set('Authorization', 'Bearer ' . $token);
$response = app()->handle($request);
echo "/auth/user/pricing-plan STATUS: " . $response->getStatusCode() . "\n";

// Delete user
$user->delete();
