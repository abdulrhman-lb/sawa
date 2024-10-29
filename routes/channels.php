<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Broadcast::channel('manager.{manager_id}', function ($user, $manager_id) {
//   return (int) $user->id === (int) $manager_id;
// });

