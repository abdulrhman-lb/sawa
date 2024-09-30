<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
  /**
   * Display the login view.
   */
  public function create(): Response
  {
    $message = Message::first();
    return Inertia::render('Auth/Login', [
      'canResetPassword'  => Route::has('password.request'),
      'status'            => session('status'),
      'message'           => $message
    ]);
  }

  public function store(LoginRequest $request): RedirectResponse
  {
    $support  = Message::first();
    $user     = User::where('email', $request->email)->first();
    if (!$user || $user->status === 'inactive') {
      return redirect()->back()->withErrors([
        'email' => 'حسابك غير مفعل، يرجى التواصل مع الدعم الفني :0'.$support->support_number,
      ]);
    }
    $request->authenticate();

    $request->session()->regenerate();
    if ($user->kind === 'admin') {
      return to_route('order.index');
    } else {
      return redirect()->intended(route('category.home', absolute: false));
    }
  }

  public function destroy(Request $request): RedirectResponse
  {
    Auth::guard('web')->logout();

    $request->session()->invalidate();

    $request->session()->regenerateToken();

    return redirect('/');
  }
}
