<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
  public function home()
  {
    $product_balance = DB::table('product_balances')
      ->select(
        DB::raw('SUM(`add`) as total_add'),
        DB::raw('SUM(`reduce`) as total_reduce'),
      )
      ->first();
    $total_product = $product_balance->total_add - $product_balance->total_reduce;
    $center_balance = DB::table('center_balances')
    ->join('users', 'users.id', '=', 'center_balances.user_id')
    ->where('users.created_by', Auth::id())
    ->select(
      DB::raw('SUM(`add`) as total_add'),
      DB::raw('SUM(`reduce`) as total_reduce'),
    )
    ->first();
    $total_center = $center_balance->total_add - $center_balance->total_reduce;
    $box = DB::table('boxes')
    ->select(
      DB::raw('SUM(`amount`) as total_amount'),
    )
    ->first();
    $total_box = $box->total_amount;
    return inertia(
      'Admin/Financial/Home',
      compact(
        'total_product',
        'total_center',
        'total_box',
      )
    );
  }
}
