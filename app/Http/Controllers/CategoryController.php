<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class CategoryController extends Controller
{
  public function index()
  {
    $query = Category::query();

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

    // Apply
    $categories = $query->orderBy($sortField, $sortDirection)->paginate(25)->onEachSide(1);
    $message = Message::first();
    return inertia("Admin/Dashboard/Category/Index", [
      "categories"  => CategoryResource::collection($categories),
      'queryParams' => request()->query() ?: null,
      'success'     => session('success'),
      'message'     => $message
    ]);
  }

  public function create()
  {
    $message = Message::first();
    return inertia("Admin/Dashboard/Category/Create", [
      'message'     => $message
    ]);
  }

  public function store(StoreCategoryRequest $request)
  {
    $data = $request->validated();
    /** @var image Illuminate\Http\UploadedFile */
    $image = $data['image'] ?? null;
    if ($image) {
      $NewImageName = Str::random() . '.' . $request->image->extension();
      $request -> image ->move(public_path('/images/categories/'), $NewImageName);
      $data['image'] = '/images/categories/'.$NewImageName;
    };
    Category::create($data);
    return to_route('category.index')->with('success', 'تم إضافة التصنيف بنجاح');
  }

  public function show(Category $category)
  {
    $message = Message::first();
    return inertia("Admin/Dashboard/Category/Show", [
      'category'=> new CategoryResource($category),
      'message'     => $message
    ]);
  }

  public function edit(Category $category)
  {
    $message = Message::first();
    return inertia("Admin/Dashboard/Category/Edit", [
      'category' => new CategoryResource($category),
      'message'     => $message
    ]);
  }

  public function update(UpdateCategoryRequest $request, Category $category)
  {
    $data = $request->validated();
    $image = $data['image'] ?? null;
    if ($image) {
      if ($category->image && file_exists(public_path($category->image))) {
        unlink(public_path($category->image));
      }
      $NewImageName = Str::random() . '.' . $request->image->extension();
      $request -> image ->move(public_path('/images/categories/'), $NewImageName);
      $data['image'] = '/images/categories/'.$NewImageName;
    } else {
      $data['image'] = $category['image'];
    }
    $category->update($data);
    return to_route('category.index')->with('success', "تم تعديل تصنيف \"$category->name\" بنجاح");
  }

  public function destroy(Category $category)
  {
    // التحقق إذا كان هناك مهام مرتبطة بالتصنيف
    if ($category->products()->count() > 0) {
      return to_route('category.index')->with('success', "لايمكن حذف التصنيف  \"$category->name\" لوجود منتجات مرتبطة به");
    }

    $name = $category->name;
    $category->delete();

    if ($category->image) {
      Storage::disk('public')->deleteDirectory(dirname($category->image));
    }

    return to_route('category.index')->with('success', "تم حذف التصنيف  \"$name\" بنجاح");
  }

  public function indexToHome()
  {
    $message = Message::first();
    $userId = Auth::id();

    $query = Category::query();
    $query->where("status", "active");
    
    $query->whereHas('category_permissions', function ($q) use ($userId) {
        $q->where('user_id', $userId);
        $q->where('status', true);
    });
    $categories = $query->orderBy('id', 'asc')->paginate(25)->onEachSide(1);
    return inertia("Category/Index", [
      "categories"  => CategoryResource::collection($categories),
      'message'     => $message
    ]);
  }
}
