<?php

namespace App\Http\Controllers;

use App\Events\NewUserRegisterEvent;
use App\Events\OrderCreated;
use App\Events\OrderReject;
use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\UserResource;
use App\Models\AmountKind;
use App\Models\CenterBalance;
use App\Models\Customer;
use App\Models\deletedOrder;
use App\Models\Message;
use App\Models\Product;
use App\Models\ProductBalance;
use App\Models\Service;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
  public function indexInProgress()
  {
    $currentUserId = auth()->id();
    $query = Order::query();
    if (auth()->user()->kind != "admin") {
      $query->join('users', 'orders.user_id', '=', 'users.id')
        ->where(function ($query) use ($currentUserId) {
          $query->where('users.process_order', 1)
            ->where(function ($query) use ($currentUserId) {
              $query->where('users.created_by', '=', $currentUserId)
                ->orWhere('users.id', '=', $currentUserId);
            });
        })->select('orders.*');
      $users = User::where('created_by', $currentUserId)->orWhere('id', '=', $currentUserId)->orderBy('name', 'asc')->get();
    } else {
      $query->join('users', 'orders.user_id', '=', 'users.id')
        ->where(function ($query) use ($currentUserId) {
          $query->where('users.created_by', '=', $currentUserId)
            ->where('users.kind', '!=', 'super_user')
            ->orwhere('users.process_order', 0)
            ->orWhere('users.id', '=', $currentUserId);
        })->select('orders.*');
      $users = User::where('created_by', '=', $currentUserId)->where('kind', '=', 'user')->orderBy('name', 'asc')->get();
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
    if (request("col")) {
      $col = request("col");
    } else {
      $col = 25;
    }
    $orders = $query->orderBy($sortField, $sortDirection)
      ->paginate($col)
      ->onEachSide(1);
    $message = Message::first();
    return inertia("Order/Index", [
      "orders"                => OrderResource::collection($orders),
      "users"                 => UserResource::collection($users),
      'queryParams'           => request()->query() ?: null,
      'success'               => session('success'),
      'message'               => $message,
    ]);
  }

  public function store(StoreOrderRequest $request)
  {
    $data = $request->validated();
    $user = User::where('id', auth()->user()->id)->first();
    $order        = Order::create($data);
    $success      = 'تم إرسال الطلب بنجاح : ';
    $service      = Service::where('id', $data['service_id'])->first();
    $success     .= $service->product->category->name . ' / ';
    $success     .= $service->product->name . ' / ';
    $success     .= $service->name . ' / ';
    $amount_kind  = AmountKind::where('id', $data['amount_kind_id'])->first();
    $success     .= $amount_kind->kindName->name . ' / بيان الدفع ';
    $success     .= $data['data_kind_1'] . ' / الزبون ';
    $customer     = Customer::where('id', $data['customer_id'])->first();
    if ($customer) {
      $success   .= $customer->name;
    } else {
      $success   .= ' غير محدد ';
    }
    $user->user_balance -= $data['net'];
    $user->save();
    event(new OrderCreated($order));
    session()->flash('success', $success);
    $product = Product::where('id', $service->product->id)->first();
    return redirect()->route("product.home", [
      'id' => $product->category_id,
      'success' => $success,
    ]);
  }

  public function update(UpdateOrderRequest $request, Order $order)
  {
    $data = $request->validated();
    $user = User::where('id', $order->user_id)->first();

    $product_balance  = DB::table('product_balances')
      ->where('product_id', $order->service->product_id)
      ->select(DB::raw('SUM(`add`) as total_add'), DB::raw('SUM(`reduce`) as total_reduce'))
      ->first();
    $remainingBalance = $product_balance->total_add - $product_balance->total_reduce;
    $productName = $order->service->product->name;
    if ($remainingBalance < $order->amount) {
      return to_route('order.in.progress')->with('success', ['1', "لايوجد رصيد في  \"$productName\" لطلب الخدمات"]);
    } else {
      $notifications = DatabaseNotification::whereRaw('JSON_EXTRACT(data, "$.order_id") = ?', [$order->id])->first();
      if ($notifications) {
        $notifications->delete();
      }
      $user->user_balance += $order->net;
      $user->save();
      $order->update($data);
      if ($data['status'] === "completed") {
        $data_product_balance = ([
          'add'         => 0,
          'reduce'      => $order->amount,
          'profit'      => $order->amount * $order->comission_admin / 100,
          'statment'    => 'طلب رقم: ' . $order->id,
          'product_id'  => $order->service->product->id,
          'order_id'    => $order->id
        ]);
        // $admin = User::where('kind', 'admin')->first();
        if ($order->comission_super === 0) {
          $data_center_admin_balance = ([
            'add'       => 0,
            'reduce'    => $order->net,
            'profit'    => $order->net - $order->amount,
            'statment'  => 'طلب رقم: ' . $order->id,
            'user_id'   => $order->user_id,
            'order_id'  => $order->id,
            'product_id'=> $order->service->product->id,
          ]);
        } else {
          $data_center_admin_balance = ([
            'add'       => 0,
            'reduce'    => $order->amount + ($order->amount * $order->comission_admin / 100),
            'profit'    => $order->amount * $order->comission_admin / 100,
            'statment'  => 'طلب رقم: ' . $order->id,
            'user_id'   => $order->user->created_by,
            'order_id'  => $order->id,
            'product_id'=> $order->service->product->id,
          ]);
          $data_center_super_balance = ([
            'add'       => 0,
            'reduce'    => $order->net,
            'profit'    => $order->amount * $order->comission_super / 100,
            'statment'  => 'طلب رقم: ' . $order->id,
            'user_id'   => $order->user_id,
            'order_id'  => $order->id,
            'product_id'=> $order->service->product->id,
          ]);
          CenterBalance::create($data_center_super_balance);
        }
        ProductBalance::create($data_product_balance);
        CenterBalance::create($data_center_admin_balance);
      }
      if ($data['status'] === "reject") {
        event(new OrderReject($order));
      }

      return to_route('order.in.progress')->with('success', ['0', "تمت معالجة الطلب"]);
    }
  }

  public function indexAll()
  {
    if (request("start_date") < request("end_date")) {
    $start_date = request("start_date");
    $end_date = request("end_date");
    } else {
      $start_date = request("end_date");
      $end_date = request("start_date");
    }
    $start_date = $start_date ? Carbon::createFromFormat('d/m/Y', $start_date)->startOfDay() : now()->startOfDay();
    $end_date = $end_date ? Carbon::createFromFormat('d/m/Y', $end_date)->endOfDay() : now()->endOfDay();

    $currentUserId  = auth()->id();
    $query          = Order::query();

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
    if (request("col")) {
      $col = request("col");
    } else {
      $col = 25;
    }
    $query->whereBetween("orders.created_at", [$start_date, $end_date]);
    $orders = $query->orderBy($sortField, $sortDirection)
      ->paginate($col)
      ->onEachSide(1);
    $message = Message::first();
    return inertia("Order/IndexAll", [
      "orders"                => OrderResource::collection($orders),
      "users"                 => UserResource::collection($users),
      'queryParams'           => request()->query() ?: null,
      'success'               => session('success'),
      'message'               => $message
    ]);
  }

  public function indexUser()
  {
    $start_date = request("date");
    $end_date = request("date");
    $start_date = $start_date ? Carbon::createFromFormat('d/m/Y', $start_date)->startOfDay() : now()->startOfDay();
    $end_date = $end_date ? Carbon::createFromFormat('d/m/Y', $end_date)->endOfDay() : now()->endOfDay();

    $currentUserId  = auth()->id();
    $query          = Order::query();

    $query->join('users', 'orders.user_id', '=', 'users.id')
      ->where(function ($query) use ($currentUserId) {
        $query->where('users.id', '=', $currentUserId);
      })
      ->select('orders.*');

    $sortField = request('sort_field', 'created_at');
    $sortDirection = request('sort_direction', 'desc');
    if (request("data_kind_1")) {
      $query->where("data_kind_1", "like", "%" . request("data_kind_1") . "%");
    }
    if (request("user_id")) {
      $query->where("user_id", request("user_id"));
    }
    if (request("status")) {
      $query->where("orders.status", request("status"));
    }

    if (request("col")) {
      $col = request("col");
    } else {
      $col = 25;
    }
    $query->whereBetween("orders.created_at", [$start_date, $end_date]);

    $orders = $query->orderBy($sortField, $sortDirection)
      ->paginate($col)
      ->onEachSide(1);
    $message = Message::first();
    return inertia("Order/IndexUser", [
      "orders"                => OrderResource::collection($orders),
      'queryParams'           => request()->query() ?: null,
      'success'               => session('success'),
      'message'               => $message
    ]);
  }

  public function destroy(Order $order)
  {
    if ($order->status != 'in_progress') {
      return to_route('order.home.user')->with('success', "لا يمكن حذف الطلب لمعالجته من قبل المسؤول");
    }
    $notifications = DatabaseNotification::whereRaw('JSON_EXTRACT(data, "$.order_id") = ?', [$order->id])->first();
    if ($notifications) {
      $notifications->delete();
    }
    $user = User::where('id', $order->user_id)->first();
    $user->user_balance += $order->net;
    $user->save();
    $order->delete();
    return to_route('order.home.user')->with('success', "تم حذف الطلب بنجاح");
  }

  public function back () {
    $order_id = (request('id'));
    $order = Order::where('id', $order_id)->first();
    $deleted_order = new deletedOrder();
    $deleted_order->amount = $order->amount;
    $deleted_order->comission_admin = $order->comission_admin;
    $deleted_order->comission_super = $order->comission_super;
    $deleted_order->net = $order->net;
    $deleted_order->status = 'deleted';
    $deleted_order->data_kind_1 = $order->data_kind_1;
    $deleted_order->data_kind_2 = $order->data_kind_2;
    $deleted_order->customer_id  = $order->customer_id;
    $deleted_order->user_id = $order->user_id;
    $deleted_order->service_id = $order->service_id;
    $deleted_order->amount_kind_id = $order->amount_kind_id;
    $deleted_order->save();
    CenterBalance::where('order_id', $order_id)->delete();
    ProductBalance::where('order_id', $order_id)->delete();
    $order->delete();
    return to_route('order.home')->with('success', ['0', "تم حذف الطلب"]);
  }
}
