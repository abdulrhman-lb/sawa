<?php

namespace App\Http\Controllers;

use App\Events\BalanceRequest;
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
    $currentUserId  = auth()->id();
    $admins         = User::where('kind', 'super_user')
                          ->orWhere('kind', 'admin')
                          ->orderBy('name')
                          ->get();
    $query = User::query();
    $query->where('id', '!=', $currentUserId);
    if (auth()->user()->kind != "admin") {
      $query->where('created_by', '=', $currentUserId);
    }
    $sortField      = request('sort_field', 'created_at');
    $sortDirection  = request('sort_direction', 'desc');
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
    } else {
      $query->where('status', 'active');
    }
    if (request("created_by")) {
      $query->where("created_by", request("created_by"));
    }
    $query->with(['category_permissions' => function ($query) {
      $query->select('category_permissions.*', 'categories.name as category_name')
            ->join('categories', 'category_permissions.category_id', '=', 'categories.id')
            ->where('category_permissions.status', true);
    }]);

    if (request("col")) {
      $col = request("col");
    } else {
      $col = 25;
    }
    $users    = $query->orderBy($sortField, $sortDirection)->paginate($col)->onEachSide(1);
    $message  = Message::first();
    return inertia("User/Index", [
      "users"                 => UserCrudResource::collection($users),
      "admins"                => $admins,
      'queryParams'           => request()->query() ?: null,
      'success'               => session('success'),
      'message'               => $message,
      'initialNotifications'  => auth()->user()->unreadNotifications,
    ]);
  }

  public function create()
  {
    $message = Message::first();
    return inertia("User/Create", [
      'message'               => $message,
      'initialNotifications'  => auth()->user()->unreadNotifications,
    ]);
  }

  public function store(StoreUserRequest $request)
  {
    $data                       = $request->validated();
    $data['password']           = bcrypt($data['password']);
    $data['email_verified_at']  = time();
    if (auth()->user()->kind === 'super_user') {
      $data['process_order'] = auth()->user()->process_order;
    } 
    $newUser    = User::create($data);
    $categories = Category::get();
    foreach ($categories as $category) {
      $category_permission['user_id']     = $newUser->id;
      $category_permission['category_id'] = $category->id;
      $category_permission['status']      = false;
      CategoryPermission::create($category_permission);
    }
    return to_route('category-permission.edit', $newUser->id)->with('success', 'تم إنشاء المركز بنجاح يمكنك إضافة الصلاحيات');
  }

  public function edit(User $user)
  {
    $currentUser  = auth()->id();
    $message      = Message::first();
    if (auth()->user()->kind === "admin") {
      return inertia("User/Edit", [
        'user'                  => new UserCrudResource($user),
        'message'               => $message,
        'initialNotifications'  => auth()->user()->unreadNotifications,
      ]);
    } else {
      if (auth()->id() === $user->created_by) {
        return inertia("User/Edit", [
          'user'                  => new UserCrudResource($user),
          'message'               => $message,
          'initialNotifications'  => auth()->user()->unreadNotifications,
        ]);
      } else {
        return to_route('user.index')->with('success', 'ليس لديك صلاحيات لعرض الصفحة');
      }
    }
  }

  public function update(UpdateUserRequest $request, User $user)
  {
    $data     = $request->validated();
    $name     = $user->name;
    $password = $data['password'] ?? null;
    if ($password) {
      $data['password'] = bcrypt($password);
    } else {
      unset($data['password']);
    }
    $user->update($data);
    if (auth()->user()->kind === 'admin' && $data['kind'] === 'super_user') {
      $users = User::where('created_by', $user->id)->get();
      foreach ($users as $user) {
        $user->process_order = $data['process_order'];
        $user->update();
      }
    }
    return to_route('user.index')->with('success', "تم تحديث بيانات المركز \"$name\" بنجاح");
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
    if ($request->addBalance) {
      $user->user_balance = $user->user_balance + $request->addBalance;
    } else {
      $user->user_balance = $user->user_balance - $request->minusBalance;
    }
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
    event(new BalanceRequest($user));
    return redirect()->back(); 
  }
}
