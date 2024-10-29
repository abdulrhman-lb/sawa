<?php

namespace App\Http\Controllers;

use App\Models\CenterBalance;
use App\Http\Requests\StoreCenterBalanceRequest;
use App\Http\Requests\UpdateCenterBalanceRequest;
use App\Http\Resources\CenterBalanceResource;
use App\Http\Resources\CenterBalanceVirtualResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\UserResource;
use App\Models\CenterBalanceVirtual;
use App\Models\Message;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class CenterBalanceController extends Controller
{
  public function index()
  {
    $query = CenterBalance::query();
    $query->where("user_id", request("center_id"));
    $sortField = request('sort_field', 'created_at');
    $sortDirection = request('sort_direction', 'desc');
    $query->orderBy($sortField, $sortDirection)->get();
    $center_balance = $query->get();
    if (request("col")) {
      $col = request("col");
    } else {
      $col = 25;
    }
    $center_balance = $query->paginate($col)->onEachSide(1);
    $balance        = DB::table('center_balances')
      ->where('user_id', request("center_id"))
      ->select(
        DB::raw('SUM(`add`) as total_add'),
        DB::raw('SUM(`reduce`) as total_reduce'),
        DB::raw('SUM(`profit`) as total_profit')
      )
      ->first();
    $remainingBalance = $balance->total_add - $balance->total_reduce;

    // الأرصدة
    $query = CenterBalanceVirtual::query();
    $query->where("user_id", request("center_id"));
    $sortField = request('sort_field', 'created_at');
    $sortDirection = request('sort_direction', 'desc');
    $query->orderBy($sortField, $sortDirection)->get();
    $center_balance_vir = $query->get();
    if (request("colBalance")) {
      $colBalance = request("colBalance");
    } else {
      $colBalance = 25;
    }
    $center_balance_vir = $query->paginate($colBalance)->onEachSide(1);
    $balance_vir        = DB::table('center_balance_virtuals')
      ->where('user_id', request("center_id"))
      ->select(
        DB::raw('SUM(`add`) as total_add'),
        DB::raw('SUM(`reduce`) as total_reduce'),
      )
      ->first();
    $remainingBalanceVir = $balance_vir->total_add - $balance_vir->total_reduce;

    $message          = Message::first();
    return inertia("Admin/Financial/CenterBalance/Index", [
      "center_balance"        => CenterBalanceResource::collection($center_balance),
      'total_add_all'         => number_format($balance->total_add),
      'total_reduce_all'      => number_format($balance->total_reduce),
      'total_profit_all'      => number_format($balance->total_profit),
      'final_balance_all'     => number_format($remainingBalance),
      'final_balance_all_test' => $remainingBalance,
      "center_balance_vir"    => CenterBalanceVirtualResource::collection($center_balance_vir),
      'total_add_all_vir'     => number_format($balance_vir->total_add),
      'total_reduce_all_vir'  => number_format($balance_vir->total_reduce),
      'final_balance_all_vir' => number_format($remainingBalanceVir),
      'success'               => session('success'),
      'message'               => $message,
      'queryParams'           => request()->query() ?: null,
    ]);
  }

  public function store(StoreCenterBalanceRequest $request)
  {
    $data = $request->validated();
    CenterBalance::create($data);
    $user = User::where('id', $data['user_id'])->first();
    $balance = DB::table('center_balance_virtuals')
      ->where('user_id', $user->id)
      ->select(
        DB::raw('SUM(`add`) as total_add'),
        DB::raw('SUM(`reduce`) as total_reduce'),
      )
      ->first();
    $allBalance = $balance->total_add - $balance->total_reduce;
    if ($allBalance != 0) {
      $dataBalance['user_id'] = $user->id;
      $dataBalance['add'] = 0;
      $dataBalance['reduce'] = $allBalance;
      $dataBalance['statment'] = 'تسديد دفعة';
      CenterBalanceVirtual::create($dataBalance);
    }
    $user->user_balance = 0;
    $user->save();

    return to_route('center.balances.home')->with('success', 'تم إضافة دفعة بنجاح');
  }

  public function update(UpdateCenterBalanceRequest $request, CenterBalance $centerBalance)
  {
    $data = $request->validated();
    $user = $centerBalance->user;
    $centerBalance->update($data);
    return to_route('center-balance.index',  ['center_id' => $centerBalance->user->id])->with('success', "تم تعديل الدفعة لصالح \"$user->name\" بنجاح");
  }

  public function destroy(CenterBalance $centerBalance)
  {
    $user = $centerBalance->user;
    $centerBalance->delete();
    return to_route('center-balance.index',  ['center_id' => $centerBalance->user->id])->with('success', "تم حذف الدفعة لصالح   \"$user->name\" بنجاح");
  }

  public function indexAll(Request $request)
  {
    $userId     = $request->input('user_id');
    $officerId  = $request->input('officerId');
    $query      = User::with(['centerBalances', 'createdBy']);
    $query->where('kind', '!=', 'admin');
    $query->where('created_by', auth()->user()->id);
    $sortField = request('sort_field', 'name');
    $sortDirection = request('sort_direction', 'asc');
    $query->orderBy($sortField, $sortDirection)->get();
    if ($userId) {
      $query->where('id', $userId);
    }
    if ($officerId) {
      $query->where('created_by', $officerId);
    }
    if (request("col")) {
      $col = request("col");
    } else {
      $col = 25;
    }
    $centers_paginated  = $query->paginate($col);
    $center_balances    = $centers_paginated->getCollection()->map(function ($center) {
      $centers        = $center->centerBalances ?? collect(); // إذا كانت null، نعين Collection فارغ
      $total_add      = $centers->sum('add');
      $total_reduce   = $centers->sum('reduce');
      $total_profilt  = $centers->sum('profit');
      $final_balance  = $total_add - $total_reduce;

      return [
        'center'                => $center,
        'total_add'             => $total_add,
        'total_reduce'          => $total_reduce,
        'total_profit'          => number_format($total_profilt),
        'final_balance'         => $final_balance,
        'final_balance_number'  => $final_balance,
        'all_balance'           => number_format($final_balance + $total_profilt),
      ];
    });
    $totals_query = $query;
    if ($userId) {
      $query->where('id', $userId);
    }
    if ($officerId) {
      $query->where('created_by', $officerId);
    }
    $total_add_all = $totals_query->get()->reduce(function ($carry, $center) {
      $balances = $center->centerBalances ?? collect();
      return $carry + $balances->sum('add');
    }, 0);
    $total_reduce_all = $totals_query->get()->reduce(function ($carry, $center) {
      $balances = $center->centerBalances ?? collect();
      return $carry + $balances->sum('reduce');
    }, 0);
    $total_profit_all = $totals_query->get()->reduce(function ($carry, $center) {
      $balances = $center->centerBalances ?? collect();
      return $carry + $balances->sum('profit');
    }, 0);
    $total_user_balance_all = User::where('created_by', auth()->user()->id)->sum('user_balance');

    $final_balance_all          = $total_add_all - $total_reduce_all;
    $all_balance_all            = $final_balance_all + $total_profit_all;
    $paginated_center_balances  = new \Illuminate\Pagination\LengthAwarePaginator(
      $center_balances,
      $centers_paginated->total(),
      $centers_paginated->perPage(),
      $centers_paginated->currentPage(),
      ['path' => $centers_paginated->path()]
    );
    $users    = User::where('created_by', auth()->user()->id)->orderBy('name', 'asc')->get();
    $message  = Message::first();
    return inertia("Admin/Financial/CenterBalance/IndexAll", [
      "center_balances"       => $paginated_center_balances,
      "users"                 => UserResource::collection($users),
      'queryParams'           => request()->query() ?: null,
      'total_add_all'         => number_format($total_add_all),
      'total_reduce_all'      => number_format($total_reduce_all),
      'total_profit_all'      => number_format($total_profit_all),
      'final_balance_all'     => number_format($final_balance_all),
      'all_balance_all'       => number_format($all_balance_all),
      'total_user_balance_all' => number_format($total_user_balance_all),
      'success'               => session('success'),
      'message'               => $message,
    ]);
  }

  public function indexUser()
  {
    $user_id = auth()->user()->id;
    $query = CenterBalance::query();
    $query->where("user_id", $user_id);
    $sortField = request('sort_field', 'created_at');
    $sortDirection = request('sort_direction', 'desc');
    $query->orderBy($sortField, $sortDirection)->get();
    $center_balance = $query->get();
    if (request("col")) {
      $col = request("col");
    } else {
      $col = 25;
    }
    $center_balance = $query->paginate($col)->onEachSide(1);
    $balance        = DB::table('center_balances')
      ->where('user_id', $user_id)
      ->select(
        DB::raw('SUM(`add`) as total_add'),
        DB::raw('SUM(`reduce`) as total_reduce'),
        DB::raw('SUM(`profit`) as total_profit')
      )
      ->first();
    $remainingBalance = $balance->total_add - $balance->total_reduce;

    // الأرصدة
    $query = CenterBalanceVirtual::query();
    $query->where("user_id", $user_id);
    $sortField = request('sort_field', 'created_at');
    $sortDirection = request('sort_direction', 'desc');
    $query->orderBy($sortField, $sortDirection)->get();
    $center_balance_vir = $query->get();
    if (request("colBalance")) {
      $colBalance = request("colBalance");
    } else {
      $colBalance = 25;
    }
    $center_balance_vir = $query->paginate($colBalance)->onEachSide(1);
    $balance_vir        = DB::table('center_balance_virtuals')
      ->where('user_id', $user_id)
      ->select(
        DB::raw('SUM(`add`) as total_add'),
        DB::raw('SUM(`reduce`) as total_reduce'),
      )
      ->first();
    $remainingBalanceVir = $balance_vir->total_add - $balance_vir->total_reduce;

    $message          = Message::first();
    return inertia("Admin/Financial/CenterBalance/IndexUser", [
      "center_balance"        => CenterBalanceResource::collection($center_balance),
      'total_add_all'         => number_format($balance->total_add),
      'total_reduce_all'      => number_format($balance->total_reduce),
      'final_balance_all'     => number_format($remainingBalance),
      'final_balance_all_test' => $remainingBalance,
      "center_balance_vir"    => CenterBalanceVirtualResource::collection($center_balance_vir),
      'total_add_all_vir'     => number_format($balance_vir->total_add),
      'total_reduce_all_vir'  => number_format($balance_vir->total_reduce),
      'final_balance_all_vir' => number_format($remainingBalanceVir),
      'success'               => session('success'),
      'message'               => $message,
      'queryParams'           => request()->query() ?: null,
    ]);
  }

  public function profit(Request $request)
  {
    $users    = User::where('created_by', auth()->user()->id)->where('kind', '!=', 'admin')->orderBy('name', 'asc')->get();
    if (auth()->user()->kind === 'admin') {
      $admins   = User::where('kind', '!=', 'user')->orderBy('name', 'asc')->get();
    } else {
      $admins   = User::where('id', auth()->user()->id)->orderBy('name', 'asc')->get();
    }
    $products = Product::where('status', 'active')->orderBy('name', 'asc')->get();
    if (request("start_date") < request("end_date")) {
      $start_date = request("start_date");
      $end_date = request("end_date");
    } else {
      $start_date = request("end_date");
      $end_date = request("start_date");
    }
    $start_date = $start_date ? Carbon::createFromFormat('d/m/Y', $start_date)->startOfDay() : now()->startOfDay();
    $end_date = $end_date ? Carbon::createFromFormat('d/m/Y', $end_date)->endOfDay() : now()->endOfDay();
    $userId     = $request->input('user_id');
    $officerId  = $request->input('admin_id');
    $productId  = $request->input('product_id');
    if ($request->input('order')) {
      $order    = $request->input('order');
    } else {
      $order    = 'total_reduce';
    }
    

    $query      = User::with(['centerBalances', 'createdBy']);
    $query->where('kind', '!=', 'admin')->get();

    if ($userId) {
      $query->where('id', $userId);
    }
    if ($officerId) {
      $query->where('created_by', $officerId);
    } else {
      $query->where('created_by', auth()->user()->id);
    }
    if ($productId) {
      $query->whereHas('centerBalances', function ($centerQuery) use ($productId) {
        $centerQuery->where('product_id', $productId);
      });
    }
    $centers_paginated  = $query->paginate(500);
    $center_balances    = $centers_paginated->getCollection()->map(function ($center) use ($productId, $start_date, $end_date) {
      $centers = $center->centerBalances;
      if ($productId) {
        $centers = $centers->where('product_id', $productId);
      }
      $centers = $centers->whereBetween("created_at", [$start_date, $end_date]);
      $centers = $centers ?? collect();
      $total_reduce   = $centers->sum('reduce');
      $total_profilt  = $centers->sum('profit');

      return [
        'center'                => $center,
        'total_reduce'          => $total_reduce,
        'total_profit'          => $total_profilt,
      ];
    });
    // dd($order);
    $center_balances = $center_balances->sortByDesc($order)->values();
    $max_total_reduce_center = $center_balances->sortByDesc('total_reduce')->first();
    $max_total_profit_center = $center_balances->sortByDesc('total_profit')->first();

    $totals_query = $query;
    $total_reduce_all = $totals_query->get()->reduce(function ($carry, $center) use ($productId, $start_date, $end_date) {
      $balances = $center->centerBalances;
      if ($productId) {
        $balances = $balances->where('product_id', $productId);
      }
      $balances = $balances->whereBetween("created_at", [$start_date, $end_date]);
      $balances = $balances ?? collect();
      return $carry + $balances->sum('reduce');
    }, 0);

    $total_profit_all = $totals_query->get()->reduce(function ($carry, $center) use ($productId, $start_date, $end_date) {
      $balances = $center->centerBalances;
      if ($productId) {
        $balances = $balances->where('product_id', $productId);
      }
      $balances = $balances->whereBetween("created_at", [$start_date, $end_date]);
      $balances = $balances ?? collect();
      return $carry + $balances->sum('profit');
    }, 0);

    $paginated_center_balances  = new \Illuminate\Pagination\LengthAwarePaginator(
      $center_balances,
      $centers_paginated->total(),
      $centers_paginated->perPage(),
      $centers_paginated->currentPage(),
      ['path' => $centers_paginated->path()]
    );

    $message          = Message::first();
    return inertia("Admin/Financial/CenterBalance/Profit", [
      'users'             => UserResource::collection($users),
      'admins'            => UserResource::collection($admins),
      'products'          => ProductResource::collection($products),
      "center_balances"   => $paginated_center_balances,
      'total_reduce_all'  => number_format($total_reduce_all),
      'total_profit_all'  => number_format($total_profit_all),
      'max_reduce'        => $max_total_reduce_center,
      'max_profit'        => $max_total_profit_center,
      'queryParams'       => request()->query() ?: null,
      'message'           => $message,
      'success'           => session('success'),
    ]);
  }
}
