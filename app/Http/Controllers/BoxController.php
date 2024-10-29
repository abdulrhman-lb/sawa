<?php

namespace App\Http\Controllers;

use App\Models\Box;
use App\Http\Requests\StoreBoxRequest;
use App\Http\Requests\UpdateBoxRequest;
use App\Http\Resources\BoxResource;
use App\Models\Message;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BoxController extends Controller
{
  public function index()
  {
    $query = Box::query();
    $sortField = request('sort_field', 'created_at');
    $sortDirection = request('sort_direction', 'desc');
    if (request("start_date") || request("end_date")) { 
      $start_date = request("start_date");
      $end_date = request("end_date");
      $start_date = request('start_date') ? Carbon::createFromFormat('d/m/Y', $start_date)->startOfDay() : now()->startOfDay();
      $end_date = request('end_date') ? Carbon::createFromFormat('d/m/Y', $end_date)->endOfDay() : now()->endOfDay();
      if (!$start_date) {
        $start_date = $end_date->copy()->startOfDay();
      }
      if (!$end_date) {
        $end_date = $start_date->copy()->endOfDay();
      }
      $query->whereBetween("created_at", [$start_date, $end_date]);
    }
    $totals_query = $query;
    $totalAmount = $totals_query->sum('amount');
    if (request("col")) {
      $col = request("col");
    } else {
      $col = 25;
    }
    $boxs = $query->orderBy($sortField, $sortDirection)->paginate($col)->onEachSide(1);
    $message = Message::first();
    return inertia("Admin/Financial/Box/Index", [
      "boxs"                  => BoxResource::collection($boxs),
      'queryParams'           => request()->query() ?: null,
      'success'               => session('success'),
      'totalAmount'           => $totalAmount,
      'message'               => $message,
    ]);
  }

  public function create()
  {
    $message = Message::first();
    return inertia("Admin/Financial/Box/Create", [
      'message'               => $message,
    ]);
  }

  public function store(StoreBoxRequest $request)
  {
    $data = $request->validated();
    Box::create($data);
    return to_route('box.index')->with('success', 'تم إضافة النفقات والمصاريف بنجاح');
  }

  public function edit(Box $box)
  {
    $message = Message::first();
    return inertia("Admin/Financial/Box/Edit", [
      'box'                   => new BoxResource($box),
      'message'               => $message,
    ]);
  }

  public function update(UpdateBoxRequest $request, Box $box)
  {
    $data = $request->validated();
    $box->update($data);
    return to_route('box.index')->with('success', "تم تعديل النفقات والمصاريف بنجاح");
  }

  public function destroy(Box $box)
  {
    $box->delete();
    return to_route('box.index')->with('success', "تم حذف النفقات والمصاريف بنجاح");
  }

  public function indexAll(Request $request)
  {
    $start_date = request('date') ? Carbon::createFromFormat('d/m/Y', request('date'))->startOfDay() : now()->startOfDay();
    $end_date = request('date') ? Carbon::createFromFormat('d/m/Y', request('date'))->endOfDay() : now()->endOfDay();
    $center_balance_query = DB::table('center_balances')
      ->join('users', 'users.id', '=', 'center_balances.user_id')
      ->where('users.created_by', Auth::id())
      ->where('order_id', "=", null)
      ->whereBetween('center_balances.created_at', [$start_date, $end_date])
      ->select('center_balances.*', 'users.name as user_name')
      ->orderBy('center_balances.created_at', 'desc');
    $center_balance = $center_balance_query->get();
    $centers_balance = DB::table('center_balances')
      ->join('users', 'users.id', '=', 'center_balances.user_id')
      ->where('users.created_by', Auth::id())
      ->whereBetween('center_balances.created_at', [$start_date, $end_date])
      ->select(DB::raw('SUM(`add`) as total_add'))
      ->first();
    $product_balance_query = DB::table('product_balances')
      ->join('products', 'products.id', '=', 'product_balances.product_id')
      ->whereBetween('product_balances.created_at', [$start_date, $end_date])
      ->where('order_id', "=", null)
      ->select('product_balances.*', 'products.name as product_name')
      ->orderBy('product_balances.created_at', 'desc');
    $product_balance = $product_balance_query->get();
    $products_balance = DB::table('product_balances')
      ->whereBetween('created_at', [$start_date, $end_date])
      ->select(DB::raw('SUM(`add`) as total_add'))
      ->first();
    $box_query = DB::table('boxes')
      ->whereBetween('boxes.created_at', [$start_date, $end_date])
      ->select('boxes.*')
      ->orderBy('boxes.created_at', 'desc');
    $box = $box_query->get();
    $boxs = DB::table('boxes')
      ->whereBetween('created_at', [$start_date, $end_date])
      ->select(DB::raw('SUM(`amount`) as total_add'))
      ->first();
    $message          = Message::first();
    return inertia("Admin/Financial/Box/IndexAll", [
      "centers"               => $center_balance,
      "products"              => $product_balance,
      "boxs"                  => $box,
      'total_center'          => number_format($centers_balance->total_add),
      'total_centerN'         => $centers_balance->total_add,
      'total_product'         => number_format($products_balance->total_add),
      'total_productN'        => $products_balance->total_add,
      'total_box'             => number_format($boxs->total_add),
      'total_boxN'            => $boxs->total_add,
      'queryParams'           => request()->query() ?: null,
      'message'               => $message,
    ]);
  }
}
