<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\AmountKindResource;
use App\Http\Resources\CustomerResource;
use App\Http\Resources\OrderResource;
use App\Http\Resources\UserResource;
use App\Models\AmountKind;
use App\Models\CenterBalance;
use App\Models\CenterBalanceVirtual;
use App\Models\Customer;
use App\Models\Product;
use App\Models\ProductBalance;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
  public function index()
  {
    $currentUserId = auth()->id();
    $query = Order::query();

    if (auth()->user()->kind != "admin") {
      $query->join('users', 'orders.user_id', '=', 'users.id')
      ->where(function ($query) use ($currentUserId) {
          $query->where('users.created_by', '=', $currentUserId)
                ->orWhere('users.id', '=', $currentUserId);
      })
      ->select('orders.*');
      $users = User::where('created_by', $currentUserId)->orWhere('id', '=', $currentUserId)->orderBy('name', 'asc')->get();
    } else {
      $users = User::orderBy('name', 'asc')->get();
    }

    $sortField = request('sort_field', 'created_at');
    $sortDirection = request('sort_direction', 'desc');

    if (request("data_kind_1")) {
      $query->where("data_kind_1", "like", "%" . request("data_kind_1") . "%");
    }
    if (request("user_id")) {
      $query->where("user_id", request("user_id"));
    }
    if (request("customer_id")) {
      $query->where("customer_id", request("customer_id"));
    }

    $query->Where('orders.status', "in_progress");
    $orders = $query->orderBy($sortField, $sortDirection)
      ->paginate(10)
      ->onEachSide(1);
    $customers = Customer::orderBy('name', 'asc')->get();
    return inertia("Order/Index", [
      "orders"      => OrderResource::collection($orders),
      "users"       => UserResource::collection($users),
      "customers"   => CustomerResource::collection($customers),
      'queryParams' => request()->query() ?: null,
      'success'     => session('success'),
    ]);
  }

  public function create()
  {
    //
  }

  public function store(StoreOrderRequest $request)
  {
    $data = $request->validated();
    Order::create($data);
    $success = 'تم إرسال الطلب بنجاح : ';
    $service = Service::where('id', $data['service_id'])->first();
    $success .= $service->product->category->name . ' / ';
    $success .= $service->product->name . ' / ';
    $success .= $service->name . ' / ';
    $amount_kind = AmountKind::where('id', $data['amount_kind_id'])->first();
    $success .= $amount_kind->kindName->name . ' / بيان الدفع ';
    $success .= $data['data_kind_1'] . ' / الزبون ';
    $customer = Customer::where('id', $data['customer_id'])->first();
    if ($customer) {
      $success .= $customer->name;
    } else {
      $success .= ' غير محدد ';
    }

    $product = Product::where('id', $service->product->id)->first();

    return to_route("service.home", ['id' => $product->id])->with([
      'success' => $success,
    ]);
  }


  public function show(Order $order)
  {
    //
  }

  public function edit(Order $order)
  {
    //
  }

  public function update(UpdateOrderRequest $request, Order $order)
  {
    $data = $request->validated();

    $product_balance = DB::table('product_balances')
      ->where('product_id', $order->service->product_id)
      ->select(DB::raw('SUM(`add`) as total_add'), DB::raw('SUM(`reduce`) as total_reduce'))
      ->first();
    $remainingBalance = $product_balance->total_add - $product_balance->total_reduce;
    $productName = $order->service->product->name;
    if ($remainingBalance <= $order->amount) {
      return to_route('order.index')->with('success', ['1', "لايوجد رصيد في  \"$productName\" لطلب الخدمات"]);
    } else {
      $order->update($data);
      if ($data['status'] === "completed") {
        $data_product_balance = ([
          'add'       => 0,
          'reduce'    => $order->amount,
          'profit'    => $order->amount * $order->comission_admin / 100,
          'statment'  => 'طلب رقم: ' . $order->id,
          'product_id' => $order->service->product->id,
          'order_id'  => $order->id
        ]);
        $admin = User::where('kind', 'admin')->first();
        if ($order->comission_super === 0) {
          $data_center_admin_balance = ([
            'add'     => 0,
            'reduce'  => $order->net,
            'profit'  => $order->net - $order->amount,
            'statment' => 'طلب رقم: ' . $order->id,
            'user_id' => $order->user_id,
            'order_id' => $order->id
          ]);
          $data_center_admin_balance_virtual = ([
            'add'     => 0,
            'reduce'  => $order->net,
            'statment' => 'طلب رقم: ' . $order->id,
            'user_id' => $order->user_id,
            'order_id' => $order->id
          ]);
          $balance_capcite = ([
            'add'     => $order->net,
            'reduce'  => 0,
            'statment' => 'طلب رقم: ' . $order->id,
            'user_id' => $admin->id,
            'order_id' => $order->id
          ]);
        } else {
          $data_center_admin_balance = ([
            'add'     => 0,
            'reduce'  => $order->amount + ($order->amount * $order->comission_admin / 100),
            'profit'  => $order->amount * $order->comission_admin / 100,
            'statment' => 'طلب رقم: ' . $order->id,
            'user_id' => $order->user->created_by,
            'order_id' => $order->id
          ]);
          $data_center_super_balance = ([
            'add'     => 0,
            'reduce'  => $order->net,
            'profit'  => $order->amount * $order->comission_super / 100,
            'statment' => 'طلب رقم: ' . $order->id,
            'user_id' => $order->user_id,
            'order_id' => $order->id
          ]);
          $data_center_admin_balance_virtual = ([
            'add'     => 0,
            'reduce'  => $order->net,
            'statment' => 'طلب رقم: ' . $order->id,
            'user_id' => $order->user_id,
            'order_id' => $order->id
          ]);
          $balance_capcite = ([
            'add'     => $order->net,
            'reduce'  => 0,
            'statment' => 'طلب رقم: ' . $order->id,
            'user_id' => $admin->id,
            'order_id' => $order->id
          ]);
          CenterBalance::create($data_center_super_balance);
        }
      }
      ProductBalance::create($data_product_balance);
      CenterBalance::create($data_center_admin_balance);
      CenterBalanceVirtual::create($data_center_admin_balance_virtual);
      CenterBalanceVirtual::create($balance_capcite);
      return to_route('order.index')->with('success', ['0', "تمت معالجة الطلب"]);
    }
  }

  public function destroy(Order $order)
  {
    //
  }
  public function indexAll()
  {
    $currentUserId = auth()->id();
    $query = Order::query();

    if (auth()->user()->kind != "admin") {
      $query->join('users', 'orders.user_id', '=', 'users.id')
      ->where(function ($query) use ($currentUserId) {
          $query->where('users.created_by', '=', $currentUserId)
                ->orWhere('users.id', '=', $currentUserId);
      })
      ->select('orders.*');
      $users = User::where('created_by', $currentUserId)->orWhere('id', '=', $currentUserId)->orderBy('name', 'asc')->get();
    } else {
      $users = User::orderBy('name', 'asc')->get();
    }

    $sortField = request('sort_field', 'created_at');
    $sortDirection = request('sort_direction', 'desc');

    if (request("data_kind_1")) {
      $query->where("data_kind_1", "like", "%" . request("data_kind_1") . "%");
    }
    if (request("user_id")) {
      $query->where("user_id", request("user_id"));
    }

    if (request("status")) {
      $query->where("status", request("status"));
    }

    $orders = $query->orderBy($sortField, $sortDirection)
      ->paginate(10)
      ->onEachSide(1);
    $customers = Customer::orderBy('name', 'asc')->get();
    return inertia("Order/IndexAll", [
      "orders"      => OrderResource::collection($orders),
      "users"       => UserResource::collection($users),
      "customers"   => CustomerResource::collection($customers),
      'queryParams' => request()->query() ?: null,
      'success'     => session('success'),
    ]);
  }
}
