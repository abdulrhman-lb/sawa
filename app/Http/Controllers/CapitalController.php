<?php

namespace App\Http\Controllers;

use App\Models\Capital;
use App\Http\Requests\StoreCapitalRequest;
use App\Http\Requests\UpdateCapitalRequest;
use App\Http\Resources\CapitalResource;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CapitalController extends Controller
{
  public function index()
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
        DB::raw('SUM(`profit`) as total_profit'),
      )
      ->first();
    $total_center = $center_balance->total_add - ($center_balance->total_reduce - $center_balance->total_profit);
    $box = DB::table('boxes')
      ->select(
        DB::raw('SUM(`amount`) as total_amount'),
      )
      ->first();
    $total_box = $box->total_amount;
    $totalAmount = Capital::sum('amount');
    if (request("col")) {
      $col = request("col");
    } else {
      $col = 25;
    }
    $capitals = Capital::orderBy('created_at', 'desc')->paginate($col)->onEachSide(1);
    $sum1     = $total_center+$totalAmount;
    $sum2     = $total_product+$total_box;
    $sum3     = $totalAmount+$center_balance->total_profit;
    $message  = Message::first();
    return inertia("Admin/Financial/Capital/Index", [
      "capitals"              => CapitalResource::collection($capitals),
      'success'               => session('success'),
      'totalAmount'           => number_format($totalAmount),
      'totalAmountN'          => $totalAmount,
      'total_product'         => $total_product,
      'total_center'          => $total_center,
      'total_box'             => $total_box,
      'total_profit'          => $center_balance->total_profit,
      'sum1'                  => $sum1,
      'sum2'                  => $sum2,
      'sum3'                  => $sum3,
      'message'               => $message,
      'initialNotifications'  => auth()->user()->unreadNotifications,
    ]);
  }

  public function create()
  {
    $message = Message::first();
    return inertia("Admin/Financial/Capital/Create",[
      'message'               => $message,
      'initialNotifications'  => auth()->user()->unreadNotifications,
    ]);
  }

  public function store(StoreCapitalRequest $request)
  {
    $data = $request->validated();
    Capital::create($data);
    return to_route('capital.index')->with('success', 'تم إضافة رأس المال بنجاح');
  }

  public function edit(Capital $capital)
  {
    $message = Message::first();
    return inertia("Admin/Financial/Capital/Edit", [
      'capital'               => new CapitalResource($capital),
      'message'               => $message,
      'initialNotifications'  => auth()->user()->unreadNotifications,
    ]);
  }

  public function update(UpdateCapitalRequest $request, Capital $capital)
  {
    $data = $request->validated();
    $capital->update($data);
    return to_route('capital.index')->with('success', "تم تعديل رأس المال بنجاح");
  }

  public function destroy(Capital $capital)
  {
    $capital->delete();
    return to_route('capital.index')->with('success', "تم حذف تفاصيل رأس المال");
  }
}
