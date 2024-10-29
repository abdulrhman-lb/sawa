<?php

use App\Http\Controllers\AmountKindController;
use App\Http\Controllers\BoxController;
use App\Http\Controllers\CapitalController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CategoryPermissionController;
use App\Http\Controllers\CenterBalanceController;
use App\Http\Controllers\CenterBalanceVirtualController;
use App\Http\Controllers\ComissionController;
use App\Http\Controllers\ComissionNewController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DataKindController;
use App\Http\Controllers\deletedOrderController;
use App\Http\Controllers\KindController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductBalanceController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TasdedController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;

Route::get('/offline', function () {
  return view('offline');
});

Route::middleware(['auth'])->group( function () {
  Route::get('/',                             [CategoryController::class,             'indexToHome'])->name('category.home');
  Route::get('/products',                     [ProductController::class,              'indexToHome'])->name('product.home');
  Route::get('/product-balances',             [ProductBalanceController::class,       'indexAll'])->name('product.balances.home');
  Route::get('/services/{id}',                [ServiceController::class,              'indexToHome'])->name('service.home');
  Route::get('/service/{id}',                 [ServiceController::class,              'indexToSelect'])->name('service.select');
  Route::get('/order-send',                   [OrderController::class,                'store'])->name('order.send');
  Route::get('/center-balances',              [CenterBalanceController::class,        'indexAll'])->name('center.balances.home');
  Route::get('/center-profit',                [CenterBalanceController::class,        'profit'])->name('center.balances.profit');
  Route::get('/orders',                       [OrderController::class,                'indexAll'])->name('order.home');
  Route::post('/order-back',                  [OrderController::class,                'back'])->name('order.back');
  Route::get('/order-deleted',                [deletedOrderController::class,         'deleted'])->name('order.deleted');
  Route::get('/order-in-progress',            [OrderController::class,                'indexInProgress'])->name('order.in.progress');
  Route::get('/orders-user',                  [OrderController::class,                'indexUser'])->name('order.home.user');
  Route::get('/daily-box',                    [BoxController::class,                  'indexAll'])->name('box.home');
  Route::post('/update-balance',              [CenterBalanceVirtualController::class, 'updateBalance'])->name('updateBalance');
  Route::post('/add-balance',                 [UserController::class,                 'addBalance'])->name('addBalance');
  Route::post('/request-balance',             [CenterBalanceVirtualController::class, 'requestBalance'])->name('requestBalance');
  Route::post('/cancel-balance',              [CenterBalanceVirtualController::class, 'cancleBalance'])->name('cancleBalance');
  Route::get('/settings',                     [MessageController::class,              'edit'])->name('settings.edit');
  Route::put('/settings-message',             [MessageController::class,              'updateMessage'])->name('settings.update.message');
  Route::put('/settings-logo',                [MessageController::class,              'updateImage'])->name('settings.update.image');
  Route::put('/settings-support',             [MessageController::class,              'updateSupport'])->name('settings.update.support');
  Route::put('/settings-tasded',              [MessageController::class,              'updateTasded'])->name('settings.update.tasded');
  Route::put('/settings-appstatus',           [MessageController::class,              'updateAppStatus'])->name('settings.update.appstatus');
  Route::get('/comission-category',           [ComissionNewController::class,         'indexComissionCategory'])->name('comission.category');
  Route::get('/comission-product',            [ComissionNewController::class,         'indexComissionProduct'])->name('comission.product');
  Route::get('/comission-service',            [ComissionNewController::class,         'indexComissionService'])->name('comission.service');
  Route::get('/comission-amount-kind',        [ComissionNewController::class,         'indexComissionAmountKind'])->name('comission.amountkind');
  Route::get('/comission-add-update',         [ComissionNewController::class,         'save'])->name('comission.addorupdate');
  Route::get('/notifications',                [NotificationController::class,         'index'])->name('notification.all');
  Route::get('/profile',                      [ProfileController::class,              'edit'])->name('profile.edit');
  Route::put('/profile',                      [ProfileController::class,              'update'])->name('profile.update');
  Route::get('/tasded',                       [TasdedController::class,               'index'])->name('tasded.index');
  Route::get('/tasded-index',                 [TasdedController::class,               'index']);
  Route::get('/tasded-home',                  [TasdedController::class,               'home'])->name('tasded.home');
  Route::post('/tasded',                      [TasdedController::class,               'store'])->name('tasded.store');
  Route::post('/tasded-response',             [TasdedController::class,               'response'])->name('tasded.response');
  Route::get('/dashboard/home',               [DashboardController::class,            'home'])->name('dashboard.home');
  Route::get('/center-balance-user',          [CenterBalanceController::class,        'indexUser'])->name('center.balance.index.user');
  Route::get('/sse-updates',                  [NotificationController::class,         'sendSSE']);
  Route::get('/customer-payment',             [CustomerController::class,             'payment'])->name('customer.payment');
  Route::get('/customer-payment-accept',      [CustomerController::class,             'paymentAccept'])->name('customer.payment.accept');

  Route::resource('/dashboard/category',      CategoryController::class);
  Route::resource('/dashboard/product',       ProductController::class);
  Route::resource('/dashboard/datakind',      DataKindController::class);
  Route::resource('/dashboard/kind',          KindController::class);
  Route::resource('/dashboard/service',       ServiceController::class);
  Route::resource('/dashboard/amountkind',    AmountKindController::class);
  Route::resource('/dashboard/comission',     ComissionController::class);
  Route::resource('/dashboard/comission-new', ComissionNewController::class);
  Route::resource('/customer',                CustomerController::class);
  Route::resource('/order',                   OrderController::class);
  Route::resource('/product-balance',         ProductBalanceController::class);
  Route::resource('/center-balance',          CenterBalanceController::class);
  Route::resource('/box',                     BoxController::class);
  Route::resource('/capital',                 CapitalController::class);
  Route::resource('/category-permission',     CategoryPermissionController::class);
  Route::resource('user',                     UserController::class);
})->middleware([
  'App\Http\Middleware\CheckMaintenanceMode',
  'App\Http\Middleware\MarkNotificationAsRead',
  ]
);

Broadcast::routes(['middleware' => ['auth']]);

require __DIR__.'/auth.php';
