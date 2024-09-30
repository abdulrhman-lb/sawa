<?php

namespace App\Listeners;

use App\Events\BalanceReject;
use App\Events\OrderReject;
use App\Models\User;
use App\Notifications\BalanceRejectNotification;
use App\Notifications\OrderRejectNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendOrderRejectNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(OrderReject $event): void
    {
      $user = User::where('id', $event->order->user_id)->first(); 
      $user->notify(new OrderRejectNotification($event->order));
    }
}
