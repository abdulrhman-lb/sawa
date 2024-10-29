<?php

namespace App\Http\Controllers;

use App\Events\OrderCreated;
use App\Models\Customer;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Resources\AmountKindResource;
use App\Http\Resources\CustomerResource;
use App\Http\Resources\ServiceResource;
use App\Models\AmountKind;
use App\Models\ComissionNew;
use App\Models\Message;
use App\Models\Order;
use App\Models\Product;
use App\Models\Service;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
  public function index()
  { {
      $query          = Customer::query();
      $query->where("created_by", Auth()->user()->id);
      $sortField      = request('sort_field', 'created_at');
      $sortDirection  = request('sort_direction', 'desc');
      if (request("name")) {
        $query->where("name", "like", "%" . request("name") . "%");
      }
      if (request("col")) {
        $col = request("col");
      } else {
        $col = 25;
      }
      $customers  = $query->orderBy($sortField, $sortDirection)->paginate($col)->onEachSide(1);
      $message    = Message::first();
      return inertia("Customer/Index", [
        "customers"             => CustomerResource::collection($customers),
        'queryParams'           => request()->query() ?: null,
        'success'               => session('success'),
        'message'               => $message,
      ]);
    }
  }

  public function create()
  {
    $products = Product::where('category_id', 1)->get();
    $services = Service::where('name', 'دفع الفاتورة')
      ->whereHas('product', function ($query) {
        $query->where('category_id', 1);
      })->get();
    $amountKinds = AmountKind::whereHas('service', function ($query) {
      $query->where('name', 'دفع الفاتورة')
        ->whereHas('product', function ($query) {
          $query->where('category_id', 1);
        });
    })->get();

    $message = Message::first();
    return inertia("Customer/Create", [
      'message'     => $message,
      'products'    => $products,
      'services'    => $services,
      'amountKinds' => AmountKindResource::collection($amountKinds),
    ]);
  }

  public function store(StoreCustomerRequest $request)
  {
    $data = $request->validated();
    Customer::create($data);
    return to_route('customer.index')->with('success', 'تم إضافة الزبون بنجاح');
  }

  public function edit(Customer $customer)
  {
    $products = Product::where('category_id', 1)->get();
    $services = Service::where('name', 'دفع الفاتورة')
      ->whereHas('product', function ($query) {
        $query->where('category_id', 1);
      })->get();
    $amountKinds = AmountKind::whereHas('service', function ($query) {
      $query->where('name', 'دفع الفاتورة')
        ->whereHas('product', function ($query) {
          $query->where('category_id', 1);
        });
    })->get();
    $customer_id = $customer->amount_kind_id;
    $product = Product::whereHas('services', function ($query) use ($customer_id) {
      $query->whereHas('amountKins', function ($subQuery) use ($customer_id) {
        $subQuery->where('id', $customer_id);
      });
    })->first();

    $message = Message::first();
    return inertia("Customer/Edit", [
      'customer'    => new CustomerResource($customer),
      'message'     => $message,
      'products'    => $products,
      'product'     => $product,
      'services'    => $services,
      'amountKinds' => AmountKindResource::collection($amountKinds),
    ]);
  }

  public function update(UpdateCustomerRequest $request, Customer $customer)
  {
    $data = $request->validated();
    $customer->update($data);
    return to_route('customer.index')->with('success', "تم تعديل الزيون \"$customer->name\" بنجاح");
  }

  public function destroy(Customer $customer)
  {
    if ($customer->orders()->count() > 0) {
      return to_route('customer.index')->with('success', "لايمكن حذف الزيون  \"$customer->name\" لوجود منتجات مرتبطة به");
    }
    $name = $customer->name;
    $customer->delete();
    return to_route('customer.index')->with('success', "تم حذف الزبون  \"$name\" بنجاح");
  }

  public function payment()
  {
    $data = Customer::where('id', request('id'))->first();
    $message = Message::first();
    $customer = Customer::where('id', $data->id)->first();
    $amount_kind = AmountKind::where('id', $data->amount_kind_id)->first();
    $comission = ComissionNew::where('user_id', auth()->user()->id)->where('amount_kind_id', $data->amount_kind_id)->first();
    $balanceProduct = 0;
    $balanceCenter = 0;
    if ($comission) {
      if ($comission->comission_admin != 0) {
        $net = $amount_kind->amount + $amount_kind->amount * ($comission->comission_admin + $comission->comission_super) / 100;

        $product_balance = DB::table('product_balances')
          ->where('product_id', $amount_kind->service->product_id)
          ->select(DB::raw('SUM(`add`) as total_add'), DB::raw('SUM(`reduce`) as total_reduce'))
          ->first();
        $remainingBalanceProduct = $product_balance->total_add - $product_balance->total_reduce - $amount_kind->amount;
        if ($remainingBalanceProduct < 0) {
          $balanceProduct = 0;
        } else {
          $balanceProduct = 1;
        }

        $center_balance = DB::table('center_balances')
          ->where('user_id', auth()->user()->id)
          ->select(DB::raw('SUM(`add`) as total_add'), DB::raw('SUM(`reduce`) as total_reduce'))
          ->first();
        $remainingBalanceCenter = $center_balance->total_add - $center_balance->total_reduce - $net + auth()->user()->user_balance;
        if ($remainingBalanceCenter < 0) {
          $balanceCenter = 0;
        } else {
          $balanceCenter = 1;
        }
      }
    }
    return inertia("Customer/Payment", [
      'customer'    => new CustomerResource($customer),
      'amount_kind' => new AmountKindResource($amount_kind),
      'message'     => $message,
      'comission'   => $comission,
      'balanceCenter'   => $balanceCenter,
      'balanceProduct'   => $balanceProduct,

    ]);
  }

  public function paymentAccept()
  {
    $data = Customer::where('id', request('id'))->first();
    $amount_kind = AmountKind::where('id', $data->amount_kind_id)->first();
    $comission = ComissionNew::where('user_id', auth()->user()->id)->where('amount_kind_id', $amount_kind->id)->first();
    $order = new Order();
    $order->amount = $amount_kind->amount;
    $order->comission_admin = $comission->comission_admin;
    $order->comission_super = $comission->comission_super;
    $order->net = $amount_kind->amount + $amount_kind->amount * ($comission->comission_admin + $comission->comission_super) / 100;
    $order->status = 'in_progress';
    $order->data_kind_1 = $data->phone;
    $order->customer_id = $data->id;
    $order->user_id = auth()->user()->id;
    $order->service_id = $amount_kind->service_id;
    $order->amount_kind_id = $amount_kind->id;
    $order->save();
    $user = User::where('id', auth()->user()->id)->first();
    $user->user_balance -= $amount_kind->amount + $amount_kind->amount * ($comission->comission_admin + $comission->comission_super) / 100;;
    $user->save();

    event(new OrderCreated($order));

    return to_route('customer.index')->with('success', "تم إرسال طلب الدفع بنجاح ");
  }
}
