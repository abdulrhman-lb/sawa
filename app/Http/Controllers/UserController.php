<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserCrudResource;

class UserController extends Controller
{
  public function index()
  {
    $currentUserId = auth()->id(); // الحصول على معرف المستخدم الحالي

    $admins = User::where('kind', 'super_user') 
      ->orWhere('kind', 'admin')
      ->orderBy('name')
      ->get();

    $query = User::query();

    $query->where('id', '!=', $currentUserId); // استثناء المستخدم الحالي من قائمة المستخدمين

    if (auth()->user()->kind != "admin") {
      $query->where('created_by', '=', $currentUserId); // لغير الادمن عرض المستخدمين المنشأين من قبل المستخدم الحالي
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
    
    // Apply
    $users = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

    return inertia("User/Index", [
      "users"       => UserCrudResource::collection($users),
      "admins"      => $admins,
      'queryParams' => request()->query() ?: null,
      'success'     => session('success'),
    ]);
  }

  public function create()
  {
    return inertia("User/Create");
  }

  public function store(StoreUserRequest $request)
  {
    $data = $request->validated();
    $data['password'] = bcrypt($data['password']);
    $data['email_verified_at'] = time();
    User::create($data);
    return to_route('user.index')->with('success', 'تم إنشاء المستخدم بنجاح');
  }

  public function show(User $user)
  {
    //
  }

  public function edit(User $user)
  {
    $currentUser = auth()->id(); // الحصول على معرف المستخدم الحالي
    if (auth()->user()->kind === "admin") {
      return inertia("User/Edit", [
        'user' => new UserCrudResource($user)
      ]);
    } else {
      if (auth()->id() === $user->created_by) {
        return inertia("User/Edit", [
          'user' => new UserCrudResource($user)
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
    return to_route('user.index')->with('success', "تم تحديث بيانات المستخدم \"$user->name\" بنجاح");
  }

  public function destroy(User $user)
  {
    if ($user->id === 1) {
      return to_route('user.index')->with('success', "لا يمكن حذف هذا المستخدم");
    } else {
      $name = $user->name;
      $user->delete();
      return to_route('user.index')->with('success', "تم حذف المستخدم \"$name\" بنجاح");
    }
  }
}
