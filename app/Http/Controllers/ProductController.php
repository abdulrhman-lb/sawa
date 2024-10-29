<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
  public function index()
  {
    $query          = Product::query();
    $sortField      = request('sort_field', 'created_at');
    $sortDirection  = request('sort_direction', 'asc');
    if (request("name")) {
      $query->where("name", "like", "%" . request("name") . "%");
    }
    if (request("status")) {
      $query->where("status", request("status"));
    }
    if (request("category_id")) {
      $query->where("category_id", request("category_id"));
    }
    if (request("col")) {
      $col = request("col");
    } else {
      $col = 25;
    }
    $products   = $query->orderBy($sortField, $sortDirection)->paginate($col)->onEachSide(1);
    $categories = Category::orderBy('name', 'asc')->get();
    $message    = Message::first();
    return inertia("Admin/Dashboard/Product/Index", [
      "products"              => ProductResource::collection($products),
      'categories'            => $categories,
      'queryParams'           => request()->query() ?: null,
      'success'               => session('success'), 
      'message'               => $message,
    ]);
  }

  public function create()
  {
    $message    = Message::first();
    $categories = Category::query()->orderBy('name')->get();
    return inertia("Admin/Dashboard/Product/Create", [
      'categories'            => CategoryResource::collection($categories),
      'message'               => $message,
    ]);
  }

  public function store(StoreProductRequest $request)
  {
    $data = $request->validated();
    /** @var image Illuminate\Http\UploadedFile */
    $image = $data['image'] ?? null;
    if ($image) {
      $NewImageName = Str::random() . '.' . $request->image->extension();
      $request -> image ->move(public_path('/images/products/'), $NewImageName);
      $data['image'] = '/images/products/'.$NewImageName;
    };
    Product::create($data);
    return to_route('product.index')->with('success', 'تم إضافة المنتج بنجاح');
  }

  public function show(Product $product)
  {
    $message = Message::first();
    return inertia("Admin/Dashboard/Product/Show", [
      'product'               => new ProductResource($product),
      'message'               => $message,
    ]);
  }

  public function edit(Product $product)
  {
    $message    = Message::first();
    $categories = Category::query()->orderBy('name')->get();
    return inertia("Admin/Dashboard/Product/Edit", [
      'product'               => new ProductResource($product),
      'categories'            => CategoryResource::collection($categories),
      'message'               => $message,
    ]);
  }

  public function update(UpdateProductRequest $request, Product $product)
  {
    $data   = $request->validated();
    $image  = $data['image'] ?? null;
    if ($image) {
      if ($product->image && file_exists(public_path($product->image))) {
        unlink(public_path($product->image));
      }
      $NewImageName = Str::random() . '.' . $request->image->extension();
      $request -> image ->move(public_path('/images/products/'), $NewImageName);
      $data['image'] = '/images/products/'.$NewImageName;
    } else {
      $data['image'] = $product['image'];
    }
    $product->update($data);
    return to_route('product.index')->with('success', "تم التعديل على المنتج  \"$product->name\" بنجاح");
  }

  public function destroy(Product $product)
  {
    if ($product->services()->count() > 0) {
      return to_route('product.index')->with('success', "لايمكن حذف المنتج  \"$product->name\" لوجود منتجات مرتبطة به");
    }
    $name = $product->name;
    $product->delete();
    if ($product->image) {
      Storage::disk('public')->deleteDirectory(dirname($product->image));
    }
    return to_route('product.index')->with('success', "تم حذف المنتج  \"$name\" بنجاح");
  }

  public function indexToHome(Request $category)
  {
    $message    = Message::first();
    $query      = Product::query();
    $query->where("status", "active");
    $query->where("category_id", $category->id);
    $products   = $query->orderBy('id', 'asc')->get();
    return inertia("Product/Index", [
      "products"              => ProductResource::collection($products),
      'message'               => $message,
      'queryParams'           => request()->query() ?: null,
    ]); 
  }
}
