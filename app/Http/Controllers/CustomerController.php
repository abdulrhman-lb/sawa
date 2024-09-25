<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
{
  public function index()
  { {
      $query = Customer::query();
      $query->where("created_by", Auth()->user()->id);
      // Sorting
      $sortField = request('sort_field', 'created_at');
      $sortDirection = request('sort_direction', 'desc');

      // Search
      if (request("name")) {
        $query->where("name", "like", "%" . request("name") . "%");
      }

      // Apply
      $customers = $query->orderBy($sortField, $sortDirection)->paginate(25)->onEachSide(1);
      $message      = Message::first();
      return inertia("Customer/Index", [
        "customers"   => CustomerResource::collection($customers),
        'queryParams' => request()->query() ?: null,
        'success'     => session('success'),
        'message'     => $message
      ]);
    }
  }

  public function create()
  {
    $message      = Message::first();
    return inertia("Customer/Create", [
      'message'     => $message
    ]);
  }

  public function store(StoreCustomerRequest $request)
  {
    $data = $request->validated();

    Customer::create($data);
    return to_route('customer.index')->with('success', 'تم إضافة الزبون بنجاح');
  }

  public function show(Customer $customer)
  {
    //
  }

  public function edit(Customer $customer)
  {
    $message      = Message::first();
    return inertia("Customer/Edit", [
      'customer' => new CustomerResource($customer),
      'message'     => $message
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
    // التحقق إذا كان هناك مهام مرتبطة بالتصنيف
    // if ($category->products()->count() > 0) {
    //   return to_route('category.index')->with('success', "لايمكن حذف التصنيف  \"$category->name\" لوجود منتجات مرتبطة به");
    // }

    $name = $customer->name;
    $customer->delete();


    return to_route('customer.index')->with('success', "تم حذف الزبون  \"$name\" بنجاح");
  }
}
