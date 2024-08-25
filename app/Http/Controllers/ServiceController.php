<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Http\Resources\AmountKindResource;
use App\Http\Resources\ComissionResource;
use App\Http\Resources\CustomerResource;
use App\Http\Resources\DataKindResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ServiceResource;
use App\Models\AmountKind;
use App\Models\Comission;
use App\Models\Customer;
use App\Models\DataKind;
use App\Models\Product;
use Illuminate\Http\Request;

class ServiceController extends Controller
{

  public function index()
  {
    $query = Service::query();

    // Sorting
    $sortField = request('sort_field', 'created_at');
    $sortDirection = request('sort_direction', 'desc');

    // Search
    if (request("name")) {
      $query->where("name", "like", "%" . request("name") . "%");
    }

    if (request("status")) {
      $query->where("status", request("status"));
    }

    if (request("product_id")) {
      $query->where("product_id", request("product_id"));
    }

    // Apply
    $services = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
    $products = Product::orderBy('name', 'asc')->get();
    return inertia("Admin/Dashboard/Service/Index", [
      "services"    => ServiceResource::collection($services),
      'products'    => $products,
      'queryParams' => request()->query() ?: null,
      'success'     => session('success'),
    ]);
  }

  public function create()
  {
    $products = Product::orderBy('name', 'asc')->get();
    $data_kinds = DataKind::orderBy('name', 'asc')->get();
    return inertia("Admin/Dashboard/Service/Create", [
      'products'  => ProductResource::collection($products),
      'data_kinds' => DataKindResource::collection($data_kinds)
    ]);
  }

  public function store(StoreServiceRequest $request)
  {
    $data = $request->validated();
    Service::create($data);
    return to_route('service.index')->with('success', 'تم إضافة الخدمة بنجاح');
  }

  public function show(Service $service)
  {
    return inertia("Admin/Dashboard/Service/Show", [
      'service' => new ServiceResource($service),
    ]);
  }

  public function edit(Service $service)
  {
    $products = Product::query()->orderBy('name')->get();
    $data_kinds = DataKind::orderBy('name', 'asc')->get();
    return inertia("Admin/Dashboard/Service/Edit", [
      'service'     => new ServiceResource($service),
      'products'    => ProductResource::collection($products),
      'data_kinds'  => DataKindResource::collection($data_kinds)
    ]);
  }

  public function update(UpdateServiceRequest $request, Service $service)
  {
    $data = $request->validated();
    $service->update($data);
    return to_route('service.index')->with('success', "تم التعديل على الخدمة  \"$service->name\" بنجاح");
  }

  public function destroy(Service $service)
  {
    // التحقق إذا كان هناك مهام مرتبطة بالمنتج
    if ($service->amountKins()->count() > 0) {
      return to_route('service.index')->with('success', "لايمكن الحذف لوجود سجلات مرتبطة ");
    }

    $name = $service->name;
    $service->delete();

    return to_route('service.index')->with('success', "تم حذف الخدمة  \"$name\" بنجاح");
  }
  public function indexToHome(Request $request, $id)
  {
    $query = Service::query();
    $query->where("status", "active");
    $query->where("product_id", $id); // Use the passed ID
    $services = $query->orderBy('id', 'asc')->get();
    $customers = Customer::orderBy('name', 'asc')->get();
    $amountKinds = AmountKind::get();
    $comissions = Comission::get();

    return inertia("Services/Index", [
      "services"      => ServiceResource::collection($services),
      'customers'     => CustomerResource::collection($customers),
      'amountKinds'   => AmountKindResource::collection($amountKinds),
      'comissions'    => ComissionResource::collection($comissions),
      'success'       => session('success'),
    ]);
  }
}