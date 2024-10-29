<?php

namespace App\Http\Controllers;

use App\Models\ComissionNew;
use App\Http\Resources\UserComissionResource;
use App\Models\AmountKind;
use App\Models\Category;
use App\Models\Message;
use App\Models\Product;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;

class ComissionNewController extends Controller
{
  public function index()
  {
    $currentUserId = auth()->id();
    if (auth()->user()->kind === 'admin') {
    $admins = User::where('kind', 'super_user')
      ->orWhere('kind', 'admin')
      ->orderBy('name')
      ->get();
    } else {
      $admins = User::where('id', $currentUserId)->get();
    }
    $query = User::query();
    $query->where('id', '!=', $currentUserId);
    $query->where('status', 'active');
    $query->where('created_by', '=', $currentUserId);
    $sortField      = request('sort_field', 'created_at');
    $sortDirection  = request('sort_direction', 'desc');
    if (request("name")) {
      $query->where("user.name", "like", "%" . request("name") . "%");
    }
    if (request("created_by")) {
      $query->where("user.created_by", request("created_by"));
    }
    $query->with(['comission_new_user' => function ($query) {
      $query->select('comission_news.*', 'amount_kinds.amount as amount')
        ->join('amount_kinds', 'comission_news.amount_kind_id', '=', 'amount_kinds.id');
    }]);
    if (request("col")) {
      $col = request("col");
    } else {
      $col = 25;
    }
    $users    = $query->orderBy($sortField, $sortDirection)->paginate($col)->onEachSide(1);
    $message  = Message::first();
    return inertia("Admin/Dashboard/ComissionNew/Index", [
      "users"                 => UserComissionResource::collection($users),
      "admins"                => $admins,
      'queryParams'           => request()->query() ?: null,
      'success'               => session('success'),
      'message'               => $message,
    ]);
  }

  public function indexComissionCategory(Request $request)
  {
    $user           = User::where('id', $request->user_id)->first();
    $categories     = Category::select('id', 'name')->get();
    $comissionData  = ComissionNew::where('user_id', $request->user_id)
      ->with([
        'amount_kind.service.product.category' => function ($query) {
          $query->select('categories.id', 'categories.name');
        }
      ])
      ->get()
      ->groupBy('amount_kind.service.product.category.id');

    $organizedData  = $categories->map(function ($category) use ($comissionData,$request, $user) {
      $comissions   = $comissionData->get($category->id, collect());
      return [
        'user_id'     => $request->user_id,
        'category_id' => $category->id,
        'category'    => $category->name,
        'products'    => $comissions->isNotEmpty()
          ? $comissions->pluck('amount_kind.service.product.name')->unique()->values()->all()
          : []
      ];
    })->values()->all();
    $message = Message::first();

    return inertia("Admin/Dashboard/ComissionNew/IndexCategoryComission", [
      "comissionData"         => $organizedData,
      'success'               => session('success'),
      'message'               => $message,
      'user_name'             => $user->name,
    ]);
  }

  public function indexComissionProduct(Request $request)
  {
    $user           = User::where('id', $request->user_id)->first();
    $category       = Category::find($request->category_id);
    $products       = Product::where('category_id', $request->category_id)->select('id', 'name')->get();
    $comissionData  = ComissionNew::where('user_id', $request->user_id)
      ->with([
        'amount_kind.service.product' => function ($query) {
          $query->select('products.id', 'products.name');
        }
      ])
      ->get()
      ->groupBy('amount_kind.service.product.id');
    $organizedData  = $products->map(function ($product) use ($comissionData, $request, $user, $category) {
      $comissions   = $comissionData->get($product->id, collect());
      return [
        'user_id'     => $user->id,
        'user_name'   => $user->name,
        'category_id' => $request->category_id,
        'product_id'  => $product->id,
        'category'    => $category->name,
        'product'     => $product->name,
        'services'    => $comissions->isNotEmpty()
          ? $comissions->pluck('amount_kind.service.name')->unique()->values()->all()
          : []
      ];
    })->values()->all(); 
    $message = Message::first();
    return inertia("Admin/Dashboard/ComissionNew/IndexProductComission", [
      "comissionData"         => $organizedData,
      'success'               => session('success'),
      'message'               => $message,
    ]);
  }

  public function indexComissionService(Request $request)
  {
    $user           = User::where('id', $request->user_id)->first();
    $product       = Product::find($request->product_id);
    $services       = Service::where('product_id', $request->product_id)->select('id', 'name')->get();
    $comissionData  = ComissionNew::where('user_id', $request->user_id)
      ->with([
        'amount_kind.service' => function ($query) {
          $query->select('services.id', 'services.name');
        }
      ])
      ->get()
      ->groupBy('amount_kind.service.id');
    $organizedData = $services->map(function ($service) use ($comissionData, $request, $user, $product) {
      $comissions = $comissionData->get($service->id, collect());
      return [
        'user_id'     => $user->id,
        'user_name'   => $user->name,
        'category_id' => $product->category_id,
        'product_id'  => $request->product_id,
        'service_id'  => $service->id,
        'category'    => $product->category->name,
        'product'     => $product->name,
        'service'     => $service->name,
        'amount_kinds'=> $comissions->isNotEmpty()
          ? $comissions->pluck('amount_kind.kindName.name')->unique()->values()->all()
          : []
      ];
    })->values()->all();
    $message = Message::first();
    return inertia("Admin/Dashboard/ComissionNew/IndexServiceComission", [
      "comissionData"         => $organizedData,
      'success'               => session('success'),
      'message'               => $message,
    ]);
  }

  public function indexComissionAmountKind(Request $request)
  {
    $user           = User::where('id', $request->user_id)->first();
    $service        = Service::find($request->service_id);
    $amount_kinds   = AmountKind::where('service_id', $request->service_id)->orderBy('amount', 'asc')->get();
    $comissionData  = ComissionNew::where('user_id', $request->user_id)->get()->groupBy('amount_kind.id');
    $organizedData  = $amount_kinds->map(function ($amount_kind) use ($comissionData, $request, $user, $service) {
      $comissions = $comissionData->get($amount_kind->id, collect());
      $isAdmin    = auth()->user()->kind === 'admin'; 
      $loggedInUserCommissions = ComissionNew::where('user_id', auth()->user()->id)
        ->where('amount_kind_id', $amount_kind->id)
        ->exists();
      $hasCommission = $isAdmin || $loggedInUserCommissions;
      return [
        'user_id'           => $user->id,
        'category_id'       => $service->product->category->id,
        'product_id'        => $service->product->id,
        'service_id'        => $service->id,
        'user_name'         => $user->name,
        'amount_kind_id'    => $amount_kind->id,
        'category'          => $service->product->category->name,
        'product'           => $service->product->name,
        'service'           => $service->name,
        'amount_kinds'      => $amount_kind,
        'amount_kind_name'  => $amount_kind->kindName->name,
        'comissions'        => $comissions,
        'has_commission'    => $hasCommission
      ];
    })->values()->all();
    $message = Message::first();
    return inertia("Admin/Dashboard/ComissionNew/IndexAmountKindComission", [
      "users"                 => $user,
      "comissionData"         => $organizedData,
      'success'               => session('success'),
      'message'               => $message,
    ]);
  }

  public function save(Request $request)
  {
    $i = 0;
    foreach ($request->data as $data) {
      if (auth()->user()->kind === "admin") {
        $data['comission_admin'] = $data['comission'];
        $data['comission_super'] = 0;
      } else {
        $comission_admin = ComissionNew::where('user_id', auth()->user()->id)->where('amount_kind_id', $data['amount_kind_id'])->first();
        if ($data['comission'] != 0) {
          $data['comission_admin'] = $comission_admin['comission_admin'];
        }
        $data['comission_super'] = $data['comission'];
      }
      $data['officer_id'] = auth()->user()->id;
      $comission_check = ComissionNew::where('user_id', $data['user_id'])->where('amount_kind_id', $data['amount_kind_id'])->first();
      if ($comission_check) {
        if (auth()->user()->kind === "admin") {
          ComissionNew::where('amount_kind_id', $data['amount_kind_id'])
            ->where('officer_id', $data['user_id'])
            ->update(['comission_admin' => $data['comission_admin']]);
        }
        $comission_check->update($data);
      } else {
        if ($data['comission'] != 0) {
          ComissionNew::create($data);
        }
      }
    };
    return back()->with('success', "تم التعديل على العمولة بنجاح");
  }
}
