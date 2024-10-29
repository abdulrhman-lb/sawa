<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Http\Resources\AmountKindResource;
use App\Http\Resources\ComissionNewResource;
use App\Http\Resources\CustomerResource;
use App\Http\Resources\DataKindResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ServiceResource;
use App\Models\AmountKind;
use App\Models\ComissionNew;
use App\Models\Customer;
use App\Models\DataKind;
use App\Models\Message;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ServiceController extends Controller
{

  public function index()
  {
    $query          = Service::query();
    $sortField      = request('sort_field', 'created_at');
    $sortDirection  = request('sort_direction', 'desc');
    if (request("name")) {
      $query->where("name", "like", "%" . request("name") . "%");
    }
    if (request("status")) {
      $query->where("status", request("status"));
    }
    if (request("product_id")) {
      $query->where("product_id", request("product_id"));
    }
    if (request("col")) {
      $col = request("col");
    } else {
      $col = 25;
    }
    $services = $query->orderBy($sortField, $sortDirection)->paginate($col)->onEachSide(1);
    $products = Product::orderBy('name', 'asc')->get();
    $message  = Message::first();
    return inertia("Admin/Dashboard/Service/Index", [
      "services"              => ServiceResource::collection($services),
      'products'              => $products,
      'queryParams'           => request()->query() ?: null,
      'success'               => session('success'),
      'message'               => $message,
    ]);
  }

  public function create()
  {
    $message    = Message::first();
    $products   = Product::orderBy('name', 'asc')->get();
    $data_kinds = DataKind::orderBy('name', 'asc')->get();
    return inertia("Admin/Dashboard/Service/Create", [
      'products'              => ProductResource::collection($products),
      'data_kinds'            => DataKindResource::collection($data_kinds),
      'message'               => $message,
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
    $message = Message::first();
    return inertia("Admin/Dashboard/Service/Show", [
      'service'               => new ServiceResource($service),
      'message'               => $message,
    ]);
  }

  public function edit(Service $service)
  {
    $message    = Message::first();
    $products   = Product::query()->orderBy('name')->get();
    $data_kinds = DataKind::orderBy('name', 'asc')->get();
    return inertia("Admin/Dashboard/Service/Edit", [
      'service'               => new ServiceResource($service),
      'products'              => ProductResource::collection($products),
      'data_kinds'            => DataKindResource::collection($data_kinds),
      'message'               => $message,
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
    if ($service->amountKins()->count() > 0) {
      return to_route('service.index')->with('success', "لايمكن الحذف لوجود سجلات مرتبطة ");
    }
    $name = $service->name;
    $service->delete();

    return to_route('service.index')->with('success', "تم حذف الخدمة  \"$name\" بنجاح");
  }
  public function indexToHome(Request $request, $id)
  {
    // الحصول على الرسالة
    $message = Message::first();

    // استعلام لجلب رصيد المركز
    $center_balance = DB::table('center_balances')
      ->where('user_id', auth()->user()->id)
      ->select(DB::raw('SUM(`add`) as total_add'), DB::raw('SUM(`reduce`) as total_reduce'))
      ->first();

    // حساب الرصيد المتبقي للمركز
    $remainingBalanceCenter = $center_balance->total_add - $center_balance->total_reduce;

    // جلب المستخدم وحساب الرصيد الإجمالي
    $user = Auth::user();
    $balance = ($user->user_balance + $remainingBalanceCenter);

    // جلب المنتج والمجموعة المرتبطة به
    $product = Product::where('id', $id)->first();
    $products = Product::where('category_id', $product->category_id)->orderBy('id', 'asc')->get();

    // جلب المركز الحالي
    $center = User::where('id', auth()->user()->id)->first();

    // التحقق من رصيد المركز
    if ($balance < 0) {
      return inertia("Product/Index", [
        "products"              => ProductResource::collection($products),
        'success'               => "لايوجد رصيد لدى  \"$center->name\" لطلب الخدمات",
        'message'               => $message,
      ]);
    }

    // استعلام لجلب رصيد المنتج
    $product_balance = DB::table('product_balances')
      ->where('product_id', $id)
      ->select(DB::raw('SUM(`add`) as total_add'), DB::raw('SUM(`reduce`) as total_reduce'))
      ->first();

    // حساب الرصيد المتبقي للمنتج
    $remainingBalanceProduct = $product_balance->total_add - $product_balance->total_reduce;

    // التحقق من رصيد المنتج
    if ($remainingBalanceProduct <= 0) {
      return inertia("Product/Index", [
        "products"              => ProductResource::collection($products),
        'success'               => "لايوجد رصيد في  \"$product->name\" لطلب الخدمات",
        'message'               => $message,
      ]);
    }

    // جلب الخدمات المرتبطة بالمنتج
    $services = Service::where("status", "active")
      ->where("product_id", $id)
      ->orderBy('id', 'asc')
      ->get();

    // جلب العملاء
    $customers = Customer::where('created_by', Auth()->user()->id)
      ->orderBy('name', 'asc')
      ->get();

    // جلب أنواع العملات والعمولات
    $amountKinds = AmountKind::get();
    $comissions  = ComissionNew::get();

    // إرجاع البيانات إلى الواجهة
    return inertia("Services/Index", [
      "services"                => ServiceResource::collection($services),
      'customers'               => CustomerResource::collection($customers),
      'amountKinds'             => AmountKindResource::collection($amountKinds),
      'comissions'              => ComissionNewResource::collection($comissions),
      'remainingBalanceProduct' => $remainingBalanceProduct,
      'remainingBalanceCenter'  => $balance,
      'success'                 => session('success'),
      'message'                 => $message,
    ]);
  }

  public function indexToSelect(Request $request, $id)
  {
    // الحصول على الرسالة
    $message = Message::first();

    // استعلام لجلب رصيد المركز
    $center_balance = DB::table('center_balances')
      ->where('user_id', auth()->user()->id)
      ->select(DB::raw('SUM(`add`) as total_add'), DB::raw('SUM(`reduce`) as total_reduce'))
      ->first();
    $remainingBalanceCenter = $center_balance->total_add - $center_balance->total_reduce;
    $user = Auth::user();
    $balance = ($user->user_balance + $remainingBalanceCenter);
    // $balance = ($user->user_balance);
    $center = User::where('id', auth()->user()->id)->first();

    // التحقق من رصيد المركز
    if ($balance < 0) {
      $product = Product::where('id', $id)->first();
      $products = Product::where('category_id', $product->category_id)->orderBy('id', 'asc')->get();
      return inertia("Product/Index", [
        "products"              => ProductResource::collection($products),
        'success'               => "لايوجد رصيد لدى  \"$center->name\" لطلب الخدمات",
        'message'               => $message,
      ]);
    }

    // استعلام لجلب رصيد المنتج
    $product_balance = DB::table('product_balances')
      ->where('product_id', $id)
      ->select(DB::raw('SUM(`add`) as total_add'), DB::raw('SUM(`reduce`) as total_reduce'))
      ->first();
    $remainingBalanceProduct = $product_balance->total_add - $product_balance->total_reduce;
    if ($remainingBalanceProduct <= 0) {
      $product = Product::where('id', $id)->first();
      $products = Product::where('category_id', $product->category_id)->orderBy('id', 'asc')->get();
      return inertia("Product/Index", [
        "products"              => ProductResource::collection($products),
        'success'               => "لايوجد رصيد في  \"$product->name\" لطلب الخدمات",
        'message'               => $message,
      ]);
    }

    // جلب الخدمات المرتبطة بالمنتج
    $services = Service::where("status", "active")
      ->where("product_id", $id)
      ->orderBy('id', 'asc')
      ->get();

    if ($request['service_id']) {
      $service = Service::with('data_kind_1', 'data_kind_2', 'product', 'product.category')
        ->where("status", "active")
        ->where("product_id", $id)
        ->where("id", $request['service_id'])
        ->first();
    } else {
      $service = Service::with('data_kind_1', 'data_kind_2', 'product', 'product.category')
        ->where("status", "active")
        ->where("product_id", $id)
        ->first();
    }

    $amountKinds = AmountKind::where('service_id', $service->id)
      ->join('comission_news', 'amount_kinds.id', '=', 'comission_news.amount_kind_id')
      ->where('comission_news.user_id', $user->id)
      ->orderBy('amount_kinds.amount', 'asc')
      ->select('amount_kinds.*')
      ->get();
      $comissions  = ComissionNew::where('user_id', $user->id)->get();

    // جلب العملاء
    $customers = Customer::where('created_by', Auth()->user()->id)
      ->orderBy('name', 'asc')
      ->get();

    // جلب أنواع العملات والعمولات
    // إرجاع البيانات إلى الواجهة
    return inertia("Services/IndexService", [
      "services"                => ServiceResource::collection($services),
      "service"                 => $service,
      'customers'               => CustomerResource::collection($customers),
      'amountKinds'             => AmountKindResource::collection($amountKinds),
      'comissions'              => ComissionNewResource::collection($comissions),
      'remainingBalanceProduct' => $remainingBalanceProduct,
      'remainingBalanceCenter'  => $balance,
      'success'                 => session('success'),
      'message'                 => $message,
    ]);
  }
}
