<?php

namespace App\Http\Middleware;

use App\Models\Message;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckMaintenanceMode
{
  /**
   * Handle an incoming request.
   *
   * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
   */
  public function handle(Request $request, Closure $next): Response
  {
    $app_status = Message::first();  // جلب حالة التطبيق

    if (auth()->check()) {  // التحقق مما إذا كان هناك مستخدم مسجل الدخول
      $user_id = auth()->user()->id;

      // إذا كان التطبيق في وضع الصيانة والمستخدم ليس الأول، يتم تسجيل الخروج
      if ($app_status->app_status === 0 && $user_id != 1) {
        Auth::logout();
        return redirect('/login')->with('success', 'The application is under maintenance.');
      }
    }

    return $next($request);  // السماح بمتابعة الطلب إذا لم تتحقق شروط الصيانة
  }
}
