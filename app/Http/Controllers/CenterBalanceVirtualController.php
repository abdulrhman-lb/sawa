<?php

namespace App\Http\Controllers;

use App\Models\CenterBalanceVirtual;
use App\Http\Requests\StoreCenterBalanceVirtualRequest;
use App\Http\Requests\UpdateCenterBalanceVirtualRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\DB;

class CenterBalanceVirtualController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index() {}


  public function create() {}

  public function store(StoreCenterBalanceVirtualRequest $request) {}

  public function show(CenterBalanceVirtual $centerBalanceVirtual) {}

  public function edit(CenterBalanceVirtual $centerBalanceVirtual) {}

  public function update(UpdateCenterBalanceVirtualRequest $request, CenterBalanceVirtual $centerBalanceVirtual) {}

  public function destroy(CenterBalanceVirtual $centerBalanceVirtual) {}

  public function indexAll(Request $request) {}

  public function updateBalance(Request $request)
  {
    $user = User::where('id', $request->user_id)->first();
    $admin = User::where('id', $user->created_by)->first();
    $balance = DB::table('center_balances')
      ->where('user_id', auth()->user()->id)
      ->select(
        DB::raw('SUM(`add`) as total_add'),
        DB::raw('SUM(`reduce`) as total_reduce'),
      )
      ->first();
    $allBalance = $balance->total_add - $balance->total_reduce + $admin->user_balance;

    if ($request->addBalance) {
      if (auth()->user()->kind  === "admin") {
        $data['user_id'] = $user->id;
        $data['add'] = $request->addBalance;
        $data['reduce'] = 0;
        $data['statment'] = 'فتح صلاحية للمركز '.$user->name;
      } else {
        if ($request->addBalance <= $allBalance) {
          $data['user_id'] = $user->id;
          $data['add'] = $request->addBalance;
          $data['reduce'] = 0;
          $data['statment'] = 'فتح صلاحية للمركز  '.$user->name;
          $dataAdmin['user_id'] = auth()->user()->id;
          $dataAdmin['add'] = 0;
          $dataAdmin['reduce'] = $request->addBalance;
          $dataAdmin['statment'] = 'تحويل رصيد إلى المركز  ' . $user->name;
          CenterBalanceVirtual::create($dataAdmin);
        } else {
          return to_route('center.balances.home')->with('success', 'ليس لديك رصيد كافي لاتمام العملية');
        }
      }
    } else {
      if ($request->minusBalance <= $user->user_balance) {
        if (auth()->user()->kind  === "admin") {
          $data['user_id'] = $user->id;
          $data['add'] = 0;
          $data['reduce'] = $request->minusBalance;
          $data['statment'] = 'سحب رصيد من المركز '.$user->name;
        } else {
          $data['user_id'] = $user->id;
          $data['add'] = 0;
          $data['reduce'] = $request->minusBalance;
          $data['statment'] = 'سحب رصيد من المركز '.$user->name;
          $dataAdmin['user_id'] = $admin->id;
          $dataAdmin['add'] = $request->minusBalance;
          $dataAdmin['reduce'] = 0;
          $dataAdmin['statment'] =  'تحويل رصيد إلى المركز  ' . $user->name;
          CenterBalanceVirtual::create($dataAdmin);
        }
      } else {
        return to_route('center.balances.home')->with('success', 'قيمة الرصيد الذي تريد سحبة أكبر من قيمة الرصيد في المركز');
      }
    }
    CenterBalanceVirtual::create($data);
    $balance = DB::table('center_balance_virtuals')
      ->where('user_id', $user->id)
      ->select(
        DB::raw('SUM(`add`) as total_add'),
        DB::raw('SUM(`reduce`) as total_reduce'),
      )
      ->first();
    $allBalance = $balance->total_add - $balance->total_reduce;
    $user->user_balance = $allBalance;
    $user->save();

    if (auth()->user()->kind  != "admin") {
      $balance = DB::table('center_balance_virtuals')
        ->where('user_id', auth()->user()->id)
        ->select(
          DB::raw('SUM(`add`) as total_add'),
          DB::raw('SUM(`reduce`) as total_reduce'),
        )
        ->first();
      $allBalance = $balance->total_add - $balance->total_reduce;
      $admin->user_balance = $allBalance;
      $admin->save();
    }
    return to_route('center.balances.home')->with('success', 'تم التعديل على الرصيد بنجاح');
  }

  public function requestBalance(Request $request)
  {
    $user = User::where('id', $request->user_id)->first();
    $admin = User::where('id', auth()->user()->id)->first();
    $balance = DB::table('center_balance_virtuals')
      ->where('user_id', auth()->user()->id)
      ->select(
        DB::raw('SUM(`add`) as total_add'),
        DB::raw('SUM(`reduce`) as total_reduce'),
      )
      ->first(); 
    $allBalance = $balance->total_add - $balance->total_reduce;
    $notifications = DatabaseNotification::whereRaw('JSON_EXTRACT(data, "$.user_id") = ?', [$user->id])->first();
    if ($notifications) {
      $notifications->delete();
    }

    if (auth()->user()->kind  === "admin") {
      $data['user_id'] = $user->id;
      $data['add'] = $user->add_balance;
      $data['reduce'] = 0;
      $data['statment'] = 'فتح صلاحية بطلب من المركز '.$user->name;
    } else {
      if ($user->add_balance <= $allBalance) {
        $data['user_id'] = $user->id;
        $data['add'] = $user->add_balance;
        $data['reduce'] = 0;
        $data['statment'] = 'فتح صلاحية بطلب من المركز';
        $dataAdmin['user_id'] = auth()->user()->id;
        $dataAdmin['add'] = - ($user->add_balance);
        $dataAdmin['reduce'] = 0;
        $dataAdmin['statment'] = 'تحويل رصيد إلى المركز  ' . $user->name;
        CenterBalanceVirtual::create($dataAdmin);
      } else {
        return to_route('center.balances.home')->with('success', 'ليس لديك رصيد كافي لاتمام العملية');
      }
    }
    CenterBalanceVirtual::create($data);
    $balance = DB::table('center_balance_virtuals')
      ->where('user_id', $user->id)
      ->select(
        DB::raw('SUM(`add`) as total_add'),
        DB::raw('SUM(`reduce`) as total_reduce'),
      )
      ->first();
    $allBalance = $balance->total_add - $balance->total_reduce;
    $user->user_balance = $allBalance;
    $user->add_balance = 0;
    $user->save();

    if (auth()->user()->kind  != "admin") {
      CenterBalanceVirtual::create($data);
      $balance = DB::table('center_balance_virtuals')
        ->where('user_id', auth()->user()->id)
        ->select(
          DB::raw('SUM(`add`) as total_add'),
          DB::raw('SUM(`reduce`) as total_reduce'),
        )
        ->first();
      $allBalance = $balance->total_add - $balance->total_reduce;
      $admin->user_balance = $allBalance;
      $admin->save();
    }
    return to_route('center.balances.home')->with('success', 'تم الاستجابة لطلب الرصيد بنجاح');
  }

  public function cancleBalance(Request $request)
  {
    $user = User::where('id', $request->user_id)->first();
    $notifications = DatabaseNotification::whereRaw('JSON_EXTRACT(data, "$.user_id") = ?', [$user->id])->first();
    if ($notifications) {
      $notifications->delete();
    }
    $data['user_id'] = $user->id;
    $data['add'] = 0;
    $data['reduce'] = 0;
    $data['statment'] = 'رفض طلب فتح صلاحية من المركز '.$user->name;
    CenterBalanceVirtual::create($data);
    $user->add_balance = 0;
    $user->save();
    return to_route('center.balances.home')->with('success', 'تم رفض طلب الرصيد');
  }
}
