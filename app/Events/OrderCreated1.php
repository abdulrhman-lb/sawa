<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderCreated implements ShouldBroadcast
{
  use Dispatchable, InteractsWithSockets, SerializesModels;

  public $order;
  public $message;
  public $manager_id;

  public function __construct(Order $order, $message, $manager_id)
  {
    $this->order = $order;
    $this->message = $message;
    $this->manager_id = $manager_id;
  }

  public function broadcastOn()
  {
    return new PrivateChannel('manager.' . $this->manager_id);
  }
}
