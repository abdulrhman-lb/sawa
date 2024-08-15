<?php

use App\Http\Controllers\BackupController;
use App\Http\Controllers\CategoryCotroller;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DataKindCotroller;
use App\Http\Controllers\ProductCotroller;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectCotroller;
use App\Http\Controllers\ServiceCotroller;
use App\Http\Controllers\TaskCotroller;
use App\Http\Controllers\UserCotroller;
use App\Models\Product;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard');

Route::middleware(['auth' , 'verified'])->group( function () {
  Route::get('/', [CategoryCotroller::class, 'indexToHome'])->name('home');

  Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
  Route::resource('project' , ProjectCotroller::class);
  Route::get('task/my-tasks' , [TaskCotroller::class, 'myTasks'])->name('task.myTasks');
  Route::resource('task' , TaskCotroller::class);
  Route::resource('user' , UserCotroller::class);
  Route::get('/download-backup', [BackupController::class, 'downloadBackup']);
});

Route::middleware('auth')->group( function () {
  Route::get('/dashboard/home', [DashboardController::class, 'home'])->name('dashboard.home');
  Route::resource('/dashboard/category', CategoryCotroller::class);
  Route::resource('/dashboard/product', ProductCotroller::class);
  Route::resource('/dashboard/datakind', DataKindCotroller::class);
  Route::resource('/dashboard/service', ServiceCotroller::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
