<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            if ((Auth::user()->kind == 'admin') && (Auth::user()->status == 'active')) {
                return $next($request);
            } else {
                return redirect('/')->with('message', 'هذه الصفحة مخصصة لمدير النظام');
            }
        } else {
            return redirect('/login')->with('message', 'الرجاء تسجيل الدخول لعرض الصفحة');
        }
        return $next($request);
    }
}
