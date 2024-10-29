<?php

namespace App\Listeners;

use App\Events\TasdedResponse;
use App\Models\User;
use App\Notifications\TasdedResponseNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendTasdedResponseNotification
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
    public function handle(TasdedResponse $event): void
    {
      $user = User::where('id', $event->tasded->user_id)->first(); 
      $user->notify(new TasdedResponseNotification($event->tasded));
    }
}
