<?php

namespace App\Http\Controllers;

use App\Models\CenterBalanceVirtual;
use App\Http\Requests\StoreCenterBalanceVirtualRequest;
use App\Http\Requests\UpdateCenterBalanceVirtualRequest;
use App\Http\Resources\CenterBalanceVirtualResource;
use App\Http\Resources\UserCrudResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CenterBalanceVirtualController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $query = CenterBalanceVirtual::query();
    $query->where("user_id", request("center_id"));
    $query->orderBy("created_at", "desc")->get();

    $center_balance = $query->get();

    $center_balance = $query->paginate(10)->onEachSide(1);
    $balance = DB::table('center_balance_virtuals')
      ->where('user_id', request("center_id"))
      ->select(
        DB::raw('SUM(`add`) as total_add'),
        DB::raw('SUM(`reduce`) as total_reduce'),
      )
      ->first();
    $remainingBalance = $balance->total_add - $balance->total_reduce;
    return inertia("Admin/Financial/CenterBalanceVirtual/Index", [
      "center_balance"   => CenterBalanceVirtualResource::collection($center_balance),
      'total_add_all'     => number_format($balance->total_add),
      'total_reduce_all'  => number_format($balance->total_reduce),
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
  public function store(StoreCenterBalanceVirtualRequest $request)
  {
    $data = $request->validated();
    $user = User::where('id', $request->user_id)->first();
    CenterBalanceVirtual::create($data);
    $balance=([
      'add'     => 0,
      'reduce'  => $request->add,
      'statment'=> 'تحويل رصيد إلى المركز: ' . $user->name,
      'user_id' => auth()->user()->id,
    ]);
    CenterBalanceVirtual::create($balance);
    return to_route('center.balances.virtual.home')->with('success', 'تم إضافة الرصيد بنجاح');
  }

  /**
   * Display the specified resource.
   */
  public function show(CenterBalanceVirtual $centerBalanceVirtual)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(CenterBalanceVirtual $centerBalanceVirtual)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateCenterBalanceVirtualRequest $request, CenterBalanceVirtual $centerBalanceVirtual)
  {
    $data = $request->validated();
    $user = $centerBalanceVirtual->user;

    $centerBalanceVirtual->update($data);
    return to_route('center-balance-virtual.index',  ['center_id' => $centerBalanceVirtual->user->id])->with('success', "تم تعديل الرصيد لصالح \"$user->name\" بنجاح");
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(CenterBalanceVirtual $centerBalanceVirtual)
  {
    $user = $centerBalanceVirtual->user;
    $centerBalanceVirtual->delete();

    return to_route('center-balance-virtual.index',  ['center_id' => $centerBalanceVirtual->user->id])->with('success', "تم حذف الرصيد لصالح   \"$user->name\" بنجاح");
  }

  public function indexAll(Request $request)
  {
    $userId  = $request->input('user_id');
    $officerId = $request->input('officerId');
    $query = User::with(['centerBalanceVirtuals', 'createdBy']);
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
      $centers = $center->centerBalanceVirtuals ?? collect(); // إذا كانت null، نعين Collection فارغ
      $total_add = $centers->sum('add');
      $total_reduce = $centers->sum('reduce');
      $final_balance = $total_add - $total_reduce;

      return [
        'center' => $center,
        'total_add' => number_format($total_add),
        'total_reduce' => number_format($total_reduce),
        'final_balance' => number_format($final_balance),
        'final_balance_number' => $final_balance,
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
      $balances = $center->centerBalanceVirtuals ?? collect();
      return $carry + $balances->sum('add');
    }, 0);
    $total_reduce_all = $totals_query->get()->reduce(function ($carry, $center) {
      $balances = $center->centerBalanceVirtuals ?? collect();
      return $carry + $balances->sum('reduce');
    }, 0);

    $final_balance_all = $total_add_all - $total_reduce_all;

    $paginated_center_balances = new \Illuminate\Pagination\LengthAwarePaginator(
      $center_balances,
      $centers_paginated->total(),
      $centers_paginated->perPage(),
      $centers_paginated->currentPage(),
      ['path' => $centers_paginated->path()]
    );
    $users = User::orderBy('name', 'asc')->get(); 
    // استخراج رصيد المستخدم 
    $center_balance = DB::table('center_balance_virtuals')
      ->where('user_id', auth()->user()->id)
      ->select(DB::raw('SUM(`add`) as total_add'), DB::raw('SUM(`reduce`) as total_reduce'))
      ->first();
    $remainingBalanceCenter = $center_balance->total_add - $center_balance->total_reduce;

    return inertia("Admin/Financial/CenterBalanceVirtual/IndexAll", [
      "center_balances"   => $paginated_center_balances,
      "users"             => UserCrudResource::collection($users),
      'queryParams'       => request()->query() ?: null,
      'total_add_all'     => number_format($total_add_all),
      'total_reduce_all'  => number_format($total_reduce_all),
      'final_balance_all' => number_format($final_balance_all),
      'remainingBalanceCenter' => $remainingBalanceCenter,
      'success'           => session('success'),
    ]);
  }
}
