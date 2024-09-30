<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class OrderCreatedNotification extends Notification
{
  use Queueable;

  protected $order;
  /**
   * Create a new notification instance.
   */
  public function __construct($order)
  {
    $this->order = $order;
  }

  /**
   * Get the notification's delivery channels.
   *
   * @return array<int, string>
   */
  public function via(object $notifiable): array
  {
    return ['database'];
  }

  /**
   * Get the mail representation of the notification.
   */
  public function toMail(object $notifiable): MailMessage
  {
    return (new MailMessage)
      ->line('The introduction to the notification.')
      ->action('Notification Action', url('/'))
      ->line('Thank you for using our application!');
  }

  public function toDatabase(object $notifiable)
  {
    return [
      'kind'    => 'orderCreated',
      'title'   => 'طلب تسديد جديد',
      'details' => "طلب  {$this->order->user->name} التسديد في {$this->order->service->product->name}",
      'image'   => $this->order->user->image,
      'url'     => url('/order')
    ];
  }

  public function toBroadcast(object $notifiable)
  {
    Log::info('Broadcasting order creation notification.');
    return new BroadcastMessage([
      'body' => 'تم إنشاء طلب جديد',
      'icon' => 'fas fa-file',
      'url' => url('/order')
    ]);
  }

  /**
   * Get the array representation of the notification.
   *
   * @return array<string, mixed>
   */
  public function toArray(object $notifiable): array
  {
    return [
      //
    ];
  }
}
