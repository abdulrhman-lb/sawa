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
use App\Models\Customer;
use App\Models\Product;
use App\Models\ProductBalance;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;

class OrderController extends Controller
{
  public function index()
  {
    $currentUserId = auth()->id(); // الحصول على معرف المستخدم الحالي
    $query = Order::query();

    if (auth()->user()->kind != "admin") {
      $query->where('created_by', '=', $currentUserId); // لغير الادمن عرض المستخدمين المنشأين من قبل المستخدم الحالي
      $users = User::where('created_by', $currentUserId)->orderBy('name', 'asc')->get();
    } else {
      $users = User::orderBy('name', 'asc')->get();
    }
    // Sorting
    $sortField = request('sort_field', 'created_at');
    $sortDirection = request('sort_direction', 'desc');

    // Search
    if (request("data_kind_1")) {
      $query->where("data_kind_1", "like", "%" . request("data_kind_1") . "%");
    }
    // dd(request("data_kind_1"));
    // if (request("status")) {
    //   $query->where("status", request("status"));
    // }
    if (request("user_id")) {
      $query->where("user_id", request("user_id"));
    }
    if (request("customer_id")) {
      $query->where("customer_id", request("customer_id"));
    }
    $query->where("status", "in_progress");

    // Apply
    $orders = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
    // dd(OrderResource::collection($orders));
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
    // Validate the request
    $data = $request->validated();

    // Create the order
    Order::create($data);

    // Prepare the success message
    $success = 'تم إرسال الطلب بنجاح : ';

    // Get the related service, product, and category
    $service = Service::where('id', $data['service_id'])->first();
    $success .= $service->product->category->name . ' / ';
    $success .= $service->product->name . ' / ';
    $success .= $service->name . ' / ';

    // Get the amount kind
    $amount_kind = AmountKind::where('id', $data['amount_kind_id'])->first();
    $success .= $amount_kind->kindName->name . ' / بيان الدفع ';
    $success .= $data['data_kind_1'] . ' / الزبون ';

    // Get the customer
    $customer = Customer::where('id', $data['customer_id'])->first();
    if ($customer) {
      $success .= $customer->name;
    } else {
      $success .= ' غير محدد ';
    }

    // Get the product related to the service
    $product = Product::where('id', $service->product->id)->first();

    // Redirect to service.home with the product ID and success message
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


  // public function update(Request $request, Order $order)
  public function update(UpdateOrderRequest $request, Order $order)
  {
    $data = $request->validated();
  
    $order->update($data);
    if ($data['status'] === "completed") {
      $data_product_balance['add'] = 0;
      $data_product_balance['reduce'] = $order->amount;
      $data_product_balance['profit'] = $order->amount * $order->comission_admin / 100;
      $data_product_balance['statment'] = 'طلب رقم: '.$order->id;
      $data_product_balance['product_id'] = $order->service->product->id;
      $data_product_balance['order_id'] = $order->id;
    }
    ProductBalance::create($data_product_balance);
    return to_route('order.index')->with('success', "تمت معالجة الطلب");
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Order $order)
  {
    //
  }
}
