<?php

use App\Http\Controllers\AmountKindController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ComissionController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DataKindController;
use App\Http\Controllers\KindController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductBalanceController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectCotroller;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TaskCotroller;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard');

Route::middleware(['auth'])->group( function () {
  Route::get('/', [CategoryController::class, 'indexToHome'])->name('category.home');
  Route::get('/products', [ProductController::class, 'indexToHome'])->name('product.home');
  Route::get('/services', [ServiceController::class, 'indexToHome'])->name('service.home');
  Route::get('/services/{id}', [ServiceController::class, 'indexToHome'])->name('service.home');
  Route::post('/order', [OrderController::class, 'store'])->name('order.store');
  Route::get('/balances', [ProductBalanceController::class, 'indexAll'])->name('product.balances.home');



  Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
  Route::resource('project' , ProjectCotroller::class);
  Route::get('task/my-tasks' , [TaskCotroller::class, 'myTasks'])->name('task.myTasks');
  Route::resource('task' , TaskCotroller::class);
  Route::resource('user' , UserController::class);
  Route::get('/download-backup', [BackupController::class, 'downloadBackup']);
});

Route::middleware('auth')->group( function () {
  Route::get('/dashboard/home', [DashboardController::class, 'home'])->name('dashboard.home');
  Route::resource('/dashboard/category', CategoryController::class);
  Route::resource('/dashboard/product', ProductController::class);
  Route::resource('/dashboard/datakind', DataKindController::class);
  Route::resource('/dashboard/kind', KindController::class);
  Route::resource('/dashboard/service', ServiceController::class);
  Route::resource('/dashboard/amountkind', AmountKindController::class);
  Route::resource('/dashboard/comission', ComissionController::class);
  Route::resource('/customer', CustomerController::class);
  Route::resource('/order', OrderController::class);
  Route::resource('/product-balance', ProductBalanceController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
