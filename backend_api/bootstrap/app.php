<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(append: [
            \App\Http\Middleware\CheckSystemMode::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(function (\Illuminate\Http\Request $request, \Throwable $e) {
            if ($request->is('api/*')) {
                return true;
            }
            return $request->expectsJson();
        });

        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, \Illuminate\Http\Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'The requested API endpoint could not be found. Please check your URL and API version prefix (e.g. /api/v1/...).',
                    'error' => 'Route Not Found',
                ], 404);
            }
        });

        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException $e, \Illuminate\Http\Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'The HTTP method is not allowed for this endpoint.',
                    'error' => 'Method Not Allowed',
                ], 405);
            }
        });
        
        $exceptions->render(function (\Throwable $e, \Illuminate\Http\Request $request) {
            if ($request->is('api/*')) {
                if ($e instanceof \Illuminate\Validation\ValidationException ||
                    $e instanceof \Illuminate\Auth\AuthenticationException ||
                    $e instanceof \Symfony\Component\HttpKernel\Exception\HttpExceptionInterface) {
                    return null;
                }
                
                $statusCode = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
                
                return response()->json([
                    'message' => app()->isProduction() 
                        ? 'An unexpected server error occurred. Please try again later.' 
                        : $e->getMessage(),
                    'error' => 'Internal Server Error',
                ], $statusCode);
            }
        });
    })->create();
