<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
  /**
   * Register any application services.
   */
  public function register(): void
  {
    //
  }

  /**
   * Bootstrap any application services.
   */
  public function boot(): void
  {
    Inertia::share([
      'user_balance' => function () {
        if (Auth::check()) {
          $center_balance = DB::table('center_balance_virtuals')
            ->where('user_id', auth()->user()->id)
            ->select(DB::raw('SUM(`add`) as total_add'), DB::raw('SUM(`reduce`) as total_reduce'))
            ->first();
          $remainingBalanceCenter = $center_balance->total_add - $center_balance->total_reduce;
          $user = Auth::user();
          $user->user_balance = $remainingBalanceCenter;
          $user->save(); // حفظ التغييرات في قاعدة البيانات
          return number_format(Auth::user()->user_balance);
        }
        return 0;
      },
    ]);
  }
}
