<?php

namespace App\Http\Controllers;

use App\Models\ProductBalance;
use App\Http\Requests\StoreProductBalanceRequest;
use App\Http\Requests\UpdateProductBalanceRequest;
use App\Http\Resources\ProductBalanceResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductBalanceController extends Controller
{
  public function index(Request $request)
  {
    // dd($request['id']);
    $query = ProductBalance::query();
    $query->where("product_id", request("id") . "%");

    // $sortField = request('sort_field', 'created_at');
    // $sortDirection = request('sort_direction', 'desc');
    // if (request("data_kind_1")) {
    //   $query->where("data_kind_1", "like", "%" . request("data_kind_1") . "%");
    // }
    // if (request("status")) {
    //   $query->where("status", request("status"));
    // }
    $product_balance = $query->paginate(10)->onEachSide(1);
    return inertia("Admin/Financial/ProductBalance/Index", [
      "product_balance"   => ProductBalanceResource::collection($product_balance),
      'queryParams'       => request()->query() ?: null,
      'success'           => session('success'),
    ]);
  }

  public function create()
  {
    //
  }

  public function store(StoreProductBalanceRequest $request)
  {
    $data = $request->validated();
    ProductBalance::create($data);
    return to_route('product.balances.home')->with('success', 'تم إضافة الرصيد بنجاح');
  }

  public function show(ProductBalance $productBalance)
  {
    //
  }

  public function edit(ProductBalance $productBalance)
  {
    //
  }

  public function update(UpdateProductBalanceRequest $request, ProductBalance $productBalance)
  {
    //
  }

  public function destroy(ProductBalance $productBalance)
  {
    //
  }

  public function indexAll(Request $request)
  {
    $productId  = $request->input('product_id');
    $categoryId = $request->input('category_id');
    $query = Product::with(['productBalances', 'category']);

    if ($productId) {
      $query->where('id', $productId);
    }
    if ($categoryId) {
      $query->where('category_id', $categoryId);
    }
    $products_paginated = $query->paginate(10);
    $product_balances = $products_paginated->getCollection()->map(function ($product) {
      $balances = $product->productBalances ?? collect(); // إذا كانت null، نعين Collection فارغ
      $total_add = $balances->sum('add');
      $total_reduce = $balances->sum('reduce');
      $total_profilt = $balances->sum('profit');
      $final_balance = $total_add - $total_reduce;

      return [
        'product' => $product,
        'total_add' => number_format($total_add),
        'total_reduce' => number_format($total_reduce),
        'total_profit' => number_format($total_profilt),
        'final_balance' => number_format($final_balance),
      ];
    });

    $totals_query = Product::with('productBalances');
    if ($productId) {
      $totals_query->where('id', $productId);
    }
    if ($categoryId) {
      $totals_query->where('category_id', $categoryId);
    }
    $total_add_all = $totals_query->get()->reduce(function ($carry, $product) {
      $balances = $product->productBalances ?? collect();
      return $carry + $balances->sum('add');
    }, 0);
    $total_reduce_all = $totals_query->get()->reduce(function ($carry, $product) {
      $balances = $product->productBalances ?? collect();
      return $carry + $balances->sum('reduce');
    }, 0);
    $total_profit_all = $totals_query->get()->reduce(function ($carry, $product) {
      $balances = $product->productBalances ?? collect();
      return $carry + $balances->sum('profit');
    }, 0);
    $final_balance_all = $total_add_all - $total_reduce_all;
    
    $paginated_product_balances = new \Illuminate\Pagination\LengthAwarePaginator(
      $product_balances,
      $products_paginated->total(),
      $products_paginated->perPage(),
      $products_paginated->currentPage(),
      ['path' => $products_paginated->path()]
    );
    $categories = Category::orderBy('name', 'asc')->get();
    $products = Product::orderBy('name', 'asc')->get();
    return inertia("Admin/Financial/ProductBalance/IndexAll", [
      "product_balances" => $paginated_product_balances, 
      "products"         => ProductResource::collection($products),
      "categories"       => ProductResource::collection($categories),
      'queryParams'      => request()->query() ?: null,
      'total_add_all'    => number_format($total_add_all), 
      'total_reduce_all' => number_format($total_reduce_all), 
      'total_profit_all' => number_format($total_profit_all), 
      'final_balance_all' => number_format($final_balance_all), 
      'success'          => session('success'),
    ]);
  }
}
