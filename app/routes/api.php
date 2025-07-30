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

Route::prefix('v1')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::apiResource('regions', RegionController::class);
    Route::apiResource('channels', ChannelController::class);
    Route::apiResource('salesmen', SalesmanController::class);
    Route::apiResource('suppliers', SupplierController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('periods', ActiveMonthYearController::class);
    Route::apiResource('targets', SalesTargetController::class);

    Route::get('/deps/channels', [DependencyController::class, 'channels']);
    Route::get('/deps/salesmen', [DependencyController::class, 'salesmen']);
    Route::get('/deps/categories', [DependencyController::class, 'categories']);
});
