<?php

namespace App\Listeners;

use App\Events\TasdedCreated;
use App\Models\User;
use App\Notifications\TasdedCreatedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendTasdedCreartedNotification
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
    public function handle(TasdedCreated $event): void
    {
      $user = User::where('id', $event->tasded->user_id)->first();
      $super_user = User::where('id', $user->created_by)->first(); 

      if ($user->process_order === 0) {
        $officer = User::where('kind', 'admin')->first(); 
      } else {
        if ($user->kind === 'user') {
          $officer = $super_user;
        } else {
          $officer = $user;
        }
      }
      $officer->notify(new TasdedCreatedNotification($event->tasded));
    }
}
