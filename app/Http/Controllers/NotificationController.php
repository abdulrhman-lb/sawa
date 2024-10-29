<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Inertia\Inertia;

class NotificationController extends Controller
{
  public function index()
  {
    $notifications      = auth()->user()->unreadNotifications;
    $message            = Message::first();
    return Inertia::render('Notification/Index', [
      'Notifications'  => $notifications,
      'message'               => $message
    ]);
  }

  // public function read()
  // {
  //   $notifications  = auth()->user()->notifications;
  //   $message        = Message::first();
  //   return Inertia::render('Notification/Index', [
  //     'initialNotifications'  => $notifications,
  //     'message'               => $message
  //   ]);
  // }

  public function sendSSE() {
    $notifications = auth()->user()->unreadNotifications;
    $count = auth()->user()->unreadNotifications->count();
    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache');
    header('Connection: keep-alive');
    if ($notifications) {
      $eventData=[
        'data'=>$notifications,
        'count'=>$count,
      ];
      echo "data:" . json_encode($eventData) . "\n\n";
    } else {
      echo "\n\n";
    }

    ob_flush();
    flush();
  }
}
