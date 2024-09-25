<?php

namespace App\Http\Controllers;

use App\Models\AmountKind;
use App\Http\Requests\StoreAmountKindRequest;
use App\Http\Requests\UpdateAmountKindRequest;
use App\Http\Resources\AmountKindResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\KindResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ServiceResource;
use App\Models\Category;
use App\Models\Kind;
use App\Models\Message;
use App\Models\Product;
use App\Models\Service;

class AmountKindController extends Controller
{
  public function index()
  {
    $query = AmountKind::query();

    // Sorting
    $sortField = request('sort_field', 'created_at');
    $sortDirection = request('sort_direction', 'desc');

    // Search
    if (request("service_id")) {
      $query->where("service_id", request("service_id"));
    }

    if (request("kind_id")) {
      $query->where("kind_id", request("kind_id"));
    }

    // Apply
    $amount_kinds = $query->orderBy($sortField, $sortDirection)->paginate(25)->onEachSide(1);
    $kinds        = Kind::orderBy('name', 'asc')->get();
    $services     = Service::orderBy('name', 'asc')->get();
    $message = Message::first();
    return inertia("Admin/Dashboard/AmountKind/Index", [
      "amount_kinds" => AmountKindResource::collection($amount_kinds),
      'kinds'       => KindResource::collection($kinds),
      'services'    => ServiceResource::collection($services),
      'queryParams' => request()->query() ?: null,
      'success'     => session('success'),
      'message'     => $message
    ]);
  }

  public function create()
  {
    $message      = Message::first();
    $kinds        = Kind::orderBy('name', 'asc')->get();
    $services     = Service::orderBy('name', 'asc')->get();
    $categories   = Category::orderBy('name', 'asc')->get();
    $products     = Product::orderBy('name', 'asc')->get();
    return inertia("Admin/Dashboard/AmountKind/Create", [
      'kinds'       => KindResource::collection($kinds),
      'services'    => ServiceResource::collection($services),
      'categories'  => CategoryResource::collection($categories),
      'products'    => ProductResource::collection($products),
      'message'     => $message
    ]);
  }

  public function store(StoreAmountKindRequest $request)
  {
    $data = $request->validated();
    AmountKind::create($data);
    $service = Service::where('id', $data['service_id'])->first();
    $service->kind = $data['kind'];
    $service->update();
    return to_route('amountkind.index')->with('success', 'تم إضافة السعر بنجاح');
  }

  public function show(AmountKind $amountKind)
  {
    return inertia("Admin/Dashboard/AmountKind/Show", [
      'amount_kinds' => new AmountKindResource($amountKind),
    ]);
  }

  public function edit(AmountKind $amountkind)
  {
    $message      = Message::first();
    $kinds        = Kind::orderBy('name', 'asc')->get();
    $services     = Service::orderBy('name', 'asc')->get();
    $products     = Product::orderBy('name', 'asc')->get();
    $categories   = Category::orderBy('name', 'asc')->get();
    return inertia("Admin/Dashboard/AmountKind/Edit", [
      'amount_kind' => new AmountKindResource($amountkind),
      'kinds'       => KindResource::collection($kinds),
      'services'    => ServiceResource::collection($services),
      'products'    => ProductResource::collection($products),
      'categories'  => CategoryResource::collection($categories),
      'message'     => $message
    ]);
  }

  public function update(UpdateAmountKindRequest $request, AmountKind $amountkind)
  {
    $data = $request->validated();

    $amountkind->update($data);
    return to_route('amountkind.index')->with('success', "تم التعديل على السعر بنجاح");
  }

  public function destroy(AmountKind $amountkind)
  {
    // التحقق إذا كان هناك سجلات مرتبطة
    if ($amountkind->comissions()->count() > 0) {
      return to_route('amountkind.index')->with('success', "لايمكن الحذف لوجود سجلات مرتبطة");
    }

    $amountkind->delete();

    return to_route('amountkind.index')->with('success', "تم حذف السعر بنجاح");
  }
}
