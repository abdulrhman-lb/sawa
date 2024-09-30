<?php

namespace App\Listeners;

use App\Events\BalanceRequest;
use App\Models\User;
use App\Notifications\BalanceRequestNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendBalanceRequestNotification
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
    public function handle(BalanceRequest $event): void
    {
      $user = User::where('id', $event->user->id)->first(); 
      $officer = User::where('id', $user->created_by)->first(); 
      $officer->notify(new BalanceRequestNotification($event->user));
    }
}
