<?php

namespace App\Http\Controllers;

use App\Models\CategoryPermission;
use App\Http\Requests\StoreCategoryPermissionRequest;
use App\Http\Resources\CategoryPermissionResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\UserCrudResource;
use App\Http\Resources\UserResource;
use App\Models\Category;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryPermissionController extends Controller
{
  public function index()
  {
    $currentUserId = auth()->id();
    $query = CategoryPermission::query();
    if (auth()->user()->kind != "user") {
      $query->join('users', 'category_permissions.user_id', '=', 'users.id')
        ->where(function ($query) use ($currentUserId) {
          $query->where('users.created_by', '=', $currentUserId);
        })
        ->select('category_permissions.*');
      $users = User::where('created_by', $currentUserId)->Where('id', '!=', $currentUserId)->orderBy('name', 'asc')->get();
      $sortField = request('sort_field', 'created_at');
      $sortDirection = request('sort_direction', 'desc');
      if (request("user_id")) {
        $query->where("user_id", request("user_id"));
      }
      if (request("col")) {
        $col = request("col");
      } else {
        $col = 25;
      }
      $category_permissions = $query->orderBy($sortField, $sortDirection)
        ->paginate($col)
        ->onEachSide(1);
      $message = Message::first();
      return inertia("Admin/Dashboard/Category/IndexPermission", [
        "category_permissions"  => CategoryPermissionResource::collection($category_permissions),
        "users"                 => UserResource::collection($users),
        'queryParams'           => request()->query() ?: null,
        'success'               => session('success'),
        'message'               => $message,
        'initialNotifications'  => auth()->user()->unreadNotifications,
      ]);
    } else {
      return to_route('category.home')->with('success', 'ليس لديك صلاحيات لعرض الصفحة');
    }
  }

  public function create()
  {
    $userId = Auth::id();
    $query  = Category::query();
    $query->where("status", "active");
    if (auth()->user()->kind != 'admin') {
      $query->whereHas('category_permissions', function ($q) use ($userId) {
        $q->where('user_id', $userId);
      });
    }
    if (request("col")) {
      $col = request("col");
    } else {
      $col = 25;
    }
    $categories = $query->orderBy('id', 'asc')->paginate($col)->onEachSide(1);
    $users      = User::where('created_by', $userId)->where('id', '!=', $userId)->orderBy('name', 'asc')->get();
    $message    = Message::first();
    return inertia("Admin/Dashboard/Category/CreatePermission", [
      'message'               => $message,
      "categories"            => CategoryResource::collection($categories),
      'users'                 => UserCrudResource::collection($users),
      'success'               => session('success'),
      'initialNotifications'  => auth()->user()->unreadNotifications,
    ]);
  }

  public function store(StoreCategoryPermissionRequest $request)
  {
    $data = $request->validated();
    $validate = CategoryPermission::where('user_id', $data['user_id'])->where('category_id', $data['category_id'])->get();
    if ($validate->count() != 0) {
      return to_route('category-permission.create')->with('success', 'هذا المركز لديه صلاحيات بالفعل');
    } else {
      CategoryPermission::create($data);
      return to_route('category-permission.index')->with('success', 'تم إضافة الصلاحيات بنجاح');
    }
  }

  public function edit($id)
  {
    $category_permissions = CategoryPermission::where('user_id', $id)->get();
    $message = Message::first();
    return inertia("Admin/Dashboard/Category/EditPermission", [
      'category_permissions'  => CategoryPermissionResource::collection($category_permissions),
      'message'               => $message,
      'initialNotifications'  => auth()->user()->unreadNotifications,
    ]);
  }

  public function update(Request $request, $user_id)
  {
    $permissions = $request->input('permissions', []);
    foreach ($permissions as $permission) {
      CategoryPermission::where('user_id', $user_id)
        ->where('category_id', $permission['category_id'])
        ->update(['status' => $permission['status']]);
    }
    return to_route('user.index')->with('success', 'تم تعديل الصلاحيات بنجاح');
  }

  public function destroy(CategoryPermission $categoryPermission)
  {
    $categoryPermission->delete();
    return to_route('category-permission.index')->with('success', "تم حذف الصلاحية بنجاح لم يعد المركز قادر على استخدام هذا التصنيف");
  }
}
