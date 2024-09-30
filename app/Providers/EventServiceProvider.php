<?php

namespace App\Providers;

use App\Events\BalanceReject;
use App\Events\BalanceRequest;
use App\Events\OrderCreated;
use App\Events\OrderReject;
use App\Listeners\AddOrder;
use App\Listeners\SendBalanceRejectNotification;
use App\Listeners\SendBalanceRequestNotification;
use App\Listeners\SendOrderCreartedNotification;
use App\Listeners\SendOrderRejectNotification;
use Illuminate\Support\ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    protected $listen = [
      OrderCreated::class => [
          SendOrderCreartedNotification::class
      ],
      BalanceRequest::class => [
        SendBalanceRequestNotification::class
    ],
    OrderReject::class => [
      SendOrderRejectNotification::class
  ],
  ];
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
