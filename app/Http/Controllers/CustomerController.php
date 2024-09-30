<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Message;

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
        'initialNotifications'  => auth()->user()->unreadNotifications,
      ]);
    }
  }

  public function create()
  {
    $message = Message::first();
    return inertia("Customer/Create", [
      'message'               => $message,
      'initialNotifications'  => auth()->user()->unreadNotifications,
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
    $message = Message::first();
    return inertia("Customer/Edit", [
      'customer'              => new CustomerResource($customer),
      'message'               => $message,
      'initialNotifications'  => auth()->user()->unreadNotifications,
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
}
