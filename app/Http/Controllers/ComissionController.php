<?php

namespace App\Http\Controllers;

use App\Models\Comission;
use App\Http\Requests\StoreComissionRequest;
use App\Http\Requests\UpdateComissionRequest;
use App\Http\Resources\AmountKindResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ComissionResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ServiceResource;
use App\Http\Resources\UserResource;
use App\Models\AmountKind;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Service;
use App\Models\User;

class ComissionController extends Controller
{
  public function index()
  {
    $currentUserId = auth()->id(); // الحصول على معرف المستخدم الحالي

    $query = Comission::query();


    if (auth()->user()->kind != "admin") {
      $query->where('user_id', '!=', $currentUserId); // استثناء المستخدم الحالي من قائمة المستخدمين
      $query->where('officer_id', '=', $currentUserId); // لغير الادمن عرض المستخدمين المنشأين من قبل المستخدم الحالي
      $admins = User::where('id', $currentUserId)->get();
      $users = User::where('created_by', $currentUserId)->orderBy('name', 'asc')->get();
    } else {
      $admins = User::where('kind', 'super_user')
        ->orWhere('kind', 'admin')
        ->orderBy('name')
        ->get();
      $users = User::orderBy('name', 'asc')->get();
    }
    // Sorting
    $sortField = request('sort_field', 'created_at');
    $sortDirection = request('sort_direction', 'desc');

    // Search

    if (request("user_id")) {
      $query->where("user_id", request("user_id"));
    }

    if (request("officer_id")) {
      $query->where("officer_id", request("officer_id"));
    }

    // Apply
    $comissions = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
    return inertia("Admin/Dashboard/Comission/Index", [
      "comissions"  => ComissionResource::collection($comissions),
      "users"       => UserResource::collection($users),
      "admins"      => $admins,
      'queryParams' => request()->query() ?: null,
      'success'     => session('success'),
    ]);
  }

  public function create()
  {
    $currentUserId = auth()->id(); // الحصول على معرف المستخدم الحالي

    if (auth()->user()->kind != "admin") {
      $admins = User::where('id', $currentUserId)->get();
    } else {
      $admins = User::where('kind', 'super_user')
        ->orWhere('kind', 'admin')
        ->orderBy('name')
        ->get();
      $users = User::orderBy('name', 'asc')->get();
    }
    $users = User::where('created_by', $currentUserId)->orderBy('name', 'asc')->get();
    $amount_kinds = AmountKind::all();
    $services     = Service::orderBy('name', 'asc')->get();
    $categories   = Category::orderBy('name', 'asc')->get();
    $products     = Product::orderBy('name', 'asc')->get();
    $comissions   = Comission::all();
    return inertia("Admin/Dashboard/Comission/Create", [
      "users"       => UserResource::collection($users),
      "admins"      => $admins,
      'amount_kinds' => AmountKindResource::collection($amount_kinds),
      'services'    => ServiceResource::collection($services),
      'categories'  => CategoryResource::collection($categories),
      'comissions'  => ComissionResource::collection($comissions),
      'products'    => ProductResource::collection($products),
    ]);
  }

  public function store(StoreComissionRequest $request)
  {
    $data = $request->validated();
    if (auth()->user()->kind === "admin") {
      $data['comission_super'] = 0;
    } else {
      $comission_admin = Comission::where('user_id', auth()->user()->id)->where('amount_kind_id', $data['amount_kind_id'])->first();
      $data['comission_super'] = $data['comission_admin'];
      $data['comission_admin'] = $comission_admin['comission_admin'];
    }
    Comission::create($data);
    return to_route('comission.index')->with('success', 'تم إضافة العمولة بنجاح');
  }

  public function show(Comission $comission) {}

  public function edit(Comission $comission)
  {

    $currentUserId = auth()->id(); // الحصول على معرف المستخدم الحالي

    if (auth()->user()->kind != "admin") {
      $admins = User::where('id', $currentUserId)->get();
    } else {
      $admins = User::where('kind', 'super_user')
        ->orWhere('kind', 'admin')
        ->orderBy('name')
        ->get();
      $users = User::orderBy('name', 'asc')->get();
    }
    $users = User::where('created_by', $currentUserId)->orderBy('name', 'asc')->get();

    $amount_kinds = AmountKind::all();
    $services     = Service::orderBy('name', 'asc')->get();
    $categories   = Category::orderBy('name', 'asc')->get();
    $products     = Product::orderBy('name', 'asc')->get();
    $comissions   = Comission::all();
    return inertia("Admin/Dashboard/Comission/Edit", [
      'comission'   => new ComissionResource($comission),
      "users"       => UserResource::collection($users),
      "admins"      => $admins,
      'amount_kinds' => AmountKindResource::collection($amount_kinds),
      'services'    => ServiceResource::collection($services),
      'categories'  => CategoryResource::collection($categories),
      'comissions'  => ComissionResource::collection($comissions),
      'products'    => ProductResource::collection($products),
    ]);
  }

  public function update(UpdateComissionRequest $request, Comission $comission)
  {
    $data = $request->validated();
    if (auth()->user()->kind === "admin") {
      Comission::where('amount_kind_id', $data['amount_kind_id'])
        ->where('officer_id', $data['user_id'])
        ->update(['comission_admin' => $data['comission_admin']]);
    } 
    $comission->update($data);
    return to_route('comission.index')->with('success', "تم التعديل على العمولة بنجاح");
  }


  public function destroy(Comission $comission)
  {
    // التحقق إذا كان هناك سجلات مرتبطة
    $order = Order::where('user_id', $comission['user_id'])->get();
    $officer = Comission::where('officer_id', $comission['user_id'])->get();
    if (($order->count() > 0) || ($officer->count() > 0)) {
      return to_route('comission.index')->with('success', "لايمكن الحذف لوجود سجلات مرتبطة");
    }
    $comission->delete();
    return to_route('comission.index')->with('success', "تم حذف العمولة بنجاح");
  }
}
