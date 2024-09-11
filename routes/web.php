<?php

use App\Http\Controllers\AmountKindController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\BoxController;
use App\Http\Controllers\CapitalController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CenterBalanceController;
use App\Http\Controllers\CenterBalanceVirtualController;
use App\Http\Controllers\ComissionController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DataKindController;
use App\Http\Controllers\KindController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductBalanceController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::middleware(['auth'])->group( function () {
  Route::get('/', [CategoryController::class, 'indexToHome'])->name('category.home');
  Route::get('/products', [ProductController::class, 'indexToHome'])->name('product.home');
  Route::get('/services', [ServiceController::class, 'indexToHome'])->name('service.home');
  Route::get('/services/{id}', [ServiceController::class, 'indexToHome'])->name('service.home');
  Route::post('/order', [OrderController::class, 'store'])->name('order.store');
  Route::get('/product-balances', [ProductBalanceController::class, 'indexAll'])->name('product.balances.home');
  Route::get('/center-balances', [CenterBalanceController::class, 'indexAll'])->name('center.balances.home');
  Route::get('/center-balance-virtuals', [CenterBalanceVirtualController::class, 'indexAll'])->name('center.balances.virtual.home');
  Route::get('/orders', [OrderController::class, 'indexAll'])->name('order.home');
  Route::get('/daily-box', [BoxController::class, 'indexAll'])->name('box.home');


  Route::resource('user' , UserController::class);
  Route::get('/download-backup', [BackupController::class, 'downloadBackup']);
});
 
Route::middleware('auth')->group( function () {
  Route::get('/dashboard/home', [DashboardController::class, 'home'])->name('dashboard.home');
  Route::resource('/dashboard/category',    CategoryController::class);
  Route::resource('/dashboard/product',     ProductController::class);
  Route::resource('/dashboard/datakind',    DataKindController::class);
  Route::resource('/dashboard/kind',        KindController::class);
  Route::resource('/dashboard/service',     ServiceController::class);
  Route::resource('/dashboard/amountkind',  AmountKindController::class);
  Route::resource('/dashboard/comission',   ComissionController::class);
  Route::resource('/customer',              CustomerController::class);
  Route::resource('/order',                 OrderController::class);
  Route::resource('/product-balance',       ProductBalanceController::class);
  Route::resource('/center-balance',        CenterBalanceController::class);
  Route::resource('/center-balance-virtual',CenterBalanceVirtualController::class);
  Route::resource('/box'                   ,BoxController::class);
  Route::resource('/capital'               ,CapitalController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
