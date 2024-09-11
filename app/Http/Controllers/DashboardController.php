<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
  public function index()
  {
    // $user = Auth()->user();
    // $totalPendingTasks = Task::query()
    //   ->where('status', 'pending')
    //   ->count();
    // $myPendingTasks = Task::query()
    //   ->where('status', 'pending')
    //   ->where('assigned_user_id', $user->id)
    //   ->count();
    // $totalInProgressTasks = Task::query()
    //   ->where('status', 'in_progress')
    //   ->count();
    // $myInProgressTasks   = Task::query()
    //   ->where('status', 'in_progress')
    //   ->where('assigned_user_id', $user->id)
    //   ->count();
    // $totalCompletedTasks = Task::query()
    //   ->where('status', 'completed')
    //   ->count();
    // $myCompletedTasks = Task::query()
    //   ->where('status', 'completed')
    //   ->where('assigned_user_id', $user->id)
    //   ->count();
    // $activeTasks = Task::query()
    //   ->whereIn('status', ['pending', 'in_progress'])
    //   ->where('assigned_user_id', $user->id)
    //   ->limit(10)
    //   ->get();
    //   $activeTasks = TaskResource::collection($activeTasks);
    //   // dd($activeTasks);
    // return inertia(
    //   'Admin/Dashboard/Dashboard',
    //   compact(
    //     'totalPendingTasks',
    //     'myPendingTasks',
    //     'totalInProgressTasks',
    //     'myInProgressTasks',
    //     'totalCompletedTasks',
    //     'myCompletedTasks',
    //     'activeTasks',
    //   )
    // );
  }

  public function home()
  {
    // $user = Auth()->user();
    // $totalPendingTasks = Task::query()
    //   ->where('status', 'pending')
    //   ->count();
    // $myPendingTasks = Task::query()
    //   ->where('status', 'pending')
    //   ->where('assigned_user_id', $user->id)
    //   ->count();
    // $totalInProgressTasks = Task::query()
    //   ->where('status', 'in_progress')
    //   ->count();
    // $myInProgressTasks   = Task::query()
    //   ->where('status', 'in_progress')
    //   ->where('assigned_user_id', $user->id)
    //   ->count();
    // $totalCompletedTasks = Task::query()
    //   ->where('status', 'completed')
    //   ->count();
    // $myCompletedTasks = Task::query()
    //   ->where('status', 'completed')
    //   ->where('assigned_user_id', $user->id)
    //   ->count();
    // $activeTasks = Task::query()
    //   ->whereIn('status', ['pending', 'in_progress'])
    //   ->where('assigned_user_id', $user->id)
    //   ->limit(10)
    //   ->get();
    //   $activeTasks = TaskResource::collection($activeTasks);
    //   // dd($activeTasks);
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
