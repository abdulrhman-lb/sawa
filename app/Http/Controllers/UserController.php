<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserCrudResource;
use App\Models\Category;
use App\Models\CategoryPermission;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
  public function index()
  {
    $currentUserId = auth()->id();

    $admins = User::where('kind', 'super_user')
      ->orWhere('kind', 'admin')
      ->orderBy('name')
      ->get();

    $query = User::query();

    $query->where('id', '!=', $currentUserId);

    if (auth()->user()->kind != "admin") {
      $query->where('created_by', '=', $currentUserId);
    }
    // Sorting
    $sortField = request('sort_field', 'created_at');
    $sortDirection = request('sort_direction', 'desc');

    // Search
    if (request("name")) {
      $query->where("name", "like", "%" . request("name") . "%");
    }
    if (request("email")) {
      $query->where("email", "like", "%" . request("email") . "%");
    }
    if (request("kind")) {
      $query->where("kind", request("kind"));
    }
    if (request("status")) {
      $query->where("status", request("status"));
    }

    if (request("created_by")) {
      $query->where("created_by", request("created_by"));
    }
    // Include category permissions
    $query->with(['category_permissions' => function ($query) {
      $query->select('category_permissions.*', 'categories.name as category_name')
        ->join('categories', 'category_permissions.category_id', '=', 'categories.id')
        ->where('category_permissions.status', true);
    }]);

    // Apply
    $users = $query->orderBy($sortField, $sortDirection)->paginate(25)->onEachSide(1);
    $message      = Message::first();
    return inertia("User/Index", [
      "users"       => UserCrudResource::collection($users),
      "admins"      => $admins,
      'queryParams' => request()->query() ?: null,
      'success'     => session('success'),
      'message'     => $message
    ]);
  }

  public function create()
  {
    $message      = Message::first();
    return inertia("User/Create", [
      'message'     => $message
    ]);
  }

  public function store(StoreUserRequest $request)
  {
    $data = $request->validated();
    $data['password'] = bcrypt($data['password']);
    $data['email_verified_at'] = time();
    $newUser = User::create($data);
    $categories = Category::get();
    foreach ($categories as $category) {
      $category_permission['user_id'] = $newUser->id;
      $category_permission['category_id'] = $category->id;
      $category_permission['status'] = false;
      CategoryPermission::create($category_permission);
    }
    return to_route('category-permission.edit', $newUser->id)->with('success', 'تم إنشاء المركز بنجاح يمكنك إضافة الصلاحيات');
  }

  public function show(User $user)
  {
    //
  }

  public function edit(User $user)
  {
    $currentUser = auth()->id();
    $message      = Message::first();
    if (auth()->user()->kind === "admin") {
      return inertia("User/Edit", [
        'user' => new UserCrudResource($user),
        'message'     => $message
      ]);
    } else {
      if (auth()->id() === $user->created_by) {
        return inertia("User/Edit", [
          'user' => new UserCrudResource($user),
          'message'     => $message
        ]);
      } else {
        return to_route('user.index')->with('success', 'ليس لديك صلاحيات لعرض الصفحة');
      }
    }
  }

  public function update(UpdateUserRequest $request, User $user)
  {
    $data = $request->validated();
    $password = $data['password'] ?? null;
    if ($password) {
      $data['password'] = bcrypt($password);
    } else {
      unset($data['password']);
    }
    $user->update($data);
    return to_route('user.index')->with('success', "تم تحديث بيانات المركز \"$user->name\" بنجاح");
  }

  public function destroy(User $user)
  {
    if ($user->id === 1) {
      return to_route('user.index')->with('success', "لا يمكن حذف هذا المركز");
    } else {
      $name = $user->name;
      $user->delete();
      return to_route('user.index')->with('success', "تم حذف المركز \"$name\" بنجاح");
    }
  }

  public function updateBalance(Request $request)
  {
    $user = User::where('id', $request->user_id)->first();
    $user->user_balance = $request->addBalance;
    $user->save();
    return to_route('center.balances.home')->with('success', 'تم تغذية الرصيد بنجاح');
  }

  public function requestBalance(Request $request)
  {
    $user = User::where('id', $request->user_id)->first();
    $user->user_balance = $user->add_balance;
    $user->add_balance = 0;
    $user->save();
    return to_route('center.balances.home')->with('success', 'تم الاستجابة لطلب الرصيد بنجاح');
  }

  public function cancleBalance(Request $request)
  {
    $user = User::where('id', $request->user_id)->first();
    $user->add_balance = 0;
    $user->save();
    return to_route('center.balances.home')->with('success', 'تم رفض طلب الرصيد');
  }

  public function addBalance(Request $request)
  {
    $user = User::where('id', Auth::user()->id)->first();
    $user->add_balance = $request->addBalance;
    $user->save();
    return redirect()->back();
  }
}
