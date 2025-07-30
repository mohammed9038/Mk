<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\RegionController;
use App\Http\Controllers\Api\V1\ChannelController;
use App\Http\Controllers\Api\V1\SalesmanController;
use App\Http\Controllers\Api\V1\SupplierController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\ActiveMonthYearController;
use App\Http\Controllers\Api\V1\SalesTargetController;
use App\Http\Controllers\Api\V1\DependencyController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\ImportController;

Route::prefix('v1')->middleware('throttle:60,1')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('regions', RegionController::class);
        Route::apiResource('channels', ChannelController::class);
        Route::apiResource('salesmen', SalesmanController::class);
        Route::apiResource('suppliers', SupplierController::class);
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('periods', ActiveMonthYearController::class);
        Route::patch('periods/{year}/{month}', [ActiveMonthYearController::class, 'patchYearMonth']);
        Route::apiResource('targets', SalesTargetController::class);
        Route::post('targets/bulk', [SalesTargetController::class, 'bulk']);

        Route::get('/deps/channels', [DependencyController::class, 'channels']);
        Route::get('/deps/salesmen', [DependencyController::class, 'salesmen']);
        Route::get('/deps/categories', [DependencyController::class, 'categories']);

        Route::get('/reports/summary', [ReportController::class, 'summary']);
        Route::get('/reports/export.xlsx', [ReportController::class, 'export']);
        Route::post('/import/master-data', [ImportController::class, 'masterData']);
    });
});
