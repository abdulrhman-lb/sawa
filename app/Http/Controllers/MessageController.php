<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Http\Requests\StoreMessageRequest;
use Inertia\Inertia;
use Illuminate\Support\Str;


class MessageController extends Controller
{
  public function edit(Message $message)
  {
    $message = Message::first();
    return Inertia::render('Admin/Dashboard/Settings/Edit', [
      'success'               => session('success'),
      'updated'               => session('updated'),
      'message'               => $message,
    ]);
  }
  public function updateMessage()
  {
    $message = Message::first();
    if (request('messages') === null) {
      $message->messages = '-';
    } else {
      $message->messages = request('messages');
    }
    $message->save();
    return to_route('settings.edit')->with('success', 'تم تحديث الرسالة الإدارية بنجاح');
  }
  public function updateImage()
  {
    $message  = Message::first();
    $image    = request('image');
    if ($message->image) {
      if ($message->image && file_exists(public_path($message->image))) {
        unlink(public_path($message->image));
      }
      $NewImageName = Str::random() . '.' . $image->extension();
      $image->move(public_path('/images/settings/'), $NewImageName);
      $data['image'] = '/images/settings/' . $NewImageName;
    }
    $message->update($data);
    return to_route('settings.edit')->with('success', 'تم تحديث اللوغو بنجاح');
  }
  public function updateSupport()
  {
    $message = Message::first();
    if (request('support_number')) {
      $message->support_number = request('support_number');
      $message->save();
      return to_route('settings.edit')->with('success', 'تم تحديث رقم الدعم الفني بنجاح');
    } else {
      return to_route('settings.edit')->with('success', 'فشل التعديل لا يمكن أن يكون رقم الدعم الفني فارغ');
    }
  }

  public function updateTasded()
  {
    $message = Message::first();

    $message->tasded = request('tasded');
    $message->save();
    return to_route('settings.edit')->with('success', 'تم تحديث صلاحية استعلام تسديد بنجاح');
  }
  
  public function updateAppStatus()
  {
    $message = Message::first();

    $message->app_status = request('app_status');
    $message->save();
    return to_route('settings.edit')->with('success', 'تم تحديث حالة التطبيق بنجاح');
  }
}
