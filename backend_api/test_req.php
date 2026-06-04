<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = App\Models\User::first();
$token = $user->issueApiToken();

$request = Illuminate\Http\Request::create(
    '/api/auth/user/pricing-plan',
    'POST',
    [],
    [],
    [],
    ['CONTENT_TYPE' => 'application/json'],
    json_encode(['pricing_plan_id' => null])
);
$request->headers->set('Authorization', 'Bearer ' . $token);

$response = app()->handle($request);

echo $response->getContent();
echo "\nSTATUS: " . $response->getStatusCode();
