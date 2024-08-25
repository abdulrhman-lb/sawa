<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class CategoryController extends Controller
{
  public function index()
  {
    $query = Order::query();
    $sortField = request('sort_field', 'created_at');
    $sortDirection = request('sort_direction', 'desc');
    if (request("data_kind_1")) {
      $query->where("data_kind_1", "like", "%" . request("data_kind_1") . "%");
    }
    if (request("status")) {
      $query->where("status", request("status"));
    }
    $categories = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
    return inertia("Admin/Dashboard/Category/Index", [
      "categories"  => CategoryResource::collection($categories),
      'queryParams' => request()->query() ?: null,
      'success'     => session('success'),
    ]);
  }

  public function create()
  {
    return inertia("Admin/Dashboard/Category/Create");
  }

  public function store(StoreCategoryRequest $request)
  {
    $data = $request->validated();
    /** @var image Illuminate\Http\UploadedFile */
    $image = $data['image'] ?? null;
    if ($image) {
      $data['image'] = $image->store('category/' . Str::random(), 'public');
    };
    Category::create($data);
    return to_route('category.index')->with('success', 'تم إضافة التصنيف بنجاح');
  }

  public function show(Category $category)
  {
    return inertia("Admin/Dashboard/Category/Show", [
      'category'=> new CategoryResource($category),
    ]);
  }

  public function edit(Category $category)
  {
    return inertia("Admin/Dashboard/Category/Edit", [
      'category' => new CategoryResource($category)
    ]);
  }

  public function update(UpdateCategoryRequest $request, Category $category)
  {
    $data = $request->validated();
    $image = $data['image'] ?? null;
    if ($image) {
      if ($category->image) {
        Storage::disk('public')->deleteDirectory(dirname($category->image));
      }
      $data['image'] = $image->store('category/' . Str::random(), 'public');
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
    $query = Category::query();
    $query->where("status", "active");
    $categories = $query->orderBy('id', 'asc')->paginate(10)->onEachSide(1);
    return inertia("Category/Index", [
      "categories"  => CategoryResource::collection($categories),
    ]);
  }
}
