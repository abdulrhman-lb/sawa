<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Inertia\Inertia;

class NotificationController extends Controller
{
  public function index()
  {
    $notifications      = auth()->user()->unreadNotifications;
    $notifications_all  = auth()->user()->notifications;
    $message            = Message::first();
    return Inertia::render('Notification/Index', [
      'initialNotifications'  => $notifications,
      'allNotifications'      => $notifications_all,
      'message'               => $message
    ]);
  }

  public function read()
  {
    $notifications  = auth()->user()->notifications;
    $message        = Message::first();
    return Inertia::render('Notification/Index', [
      'initialNotifications'  => $notifications,
      'message'               => $message
    ]);
  }
}
