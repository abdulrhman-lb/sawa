<?php

namespace App\Http\Controllers;

use App\Models\CenterBalance;
use App\Http\Requests\StoreCenterBalanceRequest;
use App\Http\Requests\UpdateCenterBalanceRequest;
use App\Http\Resources\CenterBalanceResource;
use App\Http\Resources\UserCrudResource;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;


class CenterBalanceController extends Controller
{
  public function index()
  {
    $query = CenterBalance::query();
    $query->where("user_id", request("center_id"));
    $query->orderBy("created_at", "desc")->get();

    $center_balance = $query->get();

    $center_balance = $query->paginate(10)->onEachSide(1);
    $balance = DB::table('center_balances')
      ->where('user_id', request("center_id"))
      ->select(
        DB::raw('SUM(`add`) as total_add'),
        DB::raw('SUM(`reduce`) as total_reduce'),
        DB::raw('SUM(`profit`) as total_profit')
      )
      ->first();
    $remainingBalance = $balance->total_add - $balance->total_reduce;
    return inertia("Admin/Financial/CenterBalance/Index", [
      "center_balance"   => CenterBalanceResource::collection($center_balance),
      'total_add_all'     => number_format($balance->total_add),
      'total_reduce_all'  => number_format($balance->total_reduce),
      'total_profit_all'  => number_format($balance->total_profit),
      'final_balance_all' => number_format($remainingBalance),
      'final_balance_all_test' => $remainingBalance,
      'success'           => session('success'),
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    //
  }
 
  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreCenterBalanceRequest $request)
  {
    $data = $request->validated();
    CenterBalance::create($data);
    return to_route('center.balances.home')->with('success', 'تم إضافة دفعة بنجاح');
  }

  /**
   * Display the specified resource.
   */
  public function show(CenterBalance $centerBalance)
  {
    //
  }

  public function edit(CenterBalance $centerBalance)
  {
    //
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
    $userId  = $request->input('user_id');
    $officerId = $request->input('officerId');
    $query = User::with(['centerBalances', 'createdBy']);
    $query->where('kind', '!=', 'admin');
    $query->where('created_by', auth()->user()->id);
    if ($userId) {
      $query->where('id', $userId);
    }
    if ($officerId) {
      $query->where('created_by', $officerId);
    }
    $centers_paginated = $query->paginate(10);
    $center_balances = $centers_paginated->getCollection()->map(function ($center) {
      $centers = $center->centerBalances ?? collect(); // إذا كانت null، نعين Collection فارغ
      $total_add = $centers->sum('add');
      $total_reduce = $centers->sum('reduce');
      $total_profilt = $centers->sum('profit');
      $final_balance = $total_add - $total_reduce;

      return [
        'center' => $center,
        'total_add' => number_format($total_add),
        'total_reduce' => number_format($total_reduce),
        'total_profit' => number_format($total_profilt),
        'final_balance' => number_format($final_balance),
        'final_balance_number' => $final_balance,
        'all_balance' => number_format($final_balance + $total_profilt),
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
    $final_balance_all = $total_add_all - $total_reduce_all;
    $all_balance_all = $final_balance_all + $total_profit_all;
    $paginated_center_balances = new \Illuminate\Pagination\LengthAwarePaginator(
      $center_balances,
      $centers_paginated->total(),
      $centers_paginated->perPage(),
      $centers_paginated->currentPage(),
      ['path' => $centers_paginated->path()]
    );
    $users = User::where('created_by', auth()->user()->id)->orderBy('name', 'asc')->get();
    return inertia("Admin/Financial/CenterBalance/IndexAll", [
      "center_balances"   => $paginated_center_balances,
      "users"             => UserCrudResource::collection($users),
      'queryParams'       => request()->query() ?: null,
      'total_add_all'     => number_format($total_add_all),
      'total_reduce_all'  => number_format($total_reduce_all),
      'total_profit_all'  => number_format($total_profit_all),
      'final_balance_all' => number_format($final_balance_all),
      'all_balance_all' => number_format($all_balance_all),
      'success'           => session('success'),
    ]);
  }
}
