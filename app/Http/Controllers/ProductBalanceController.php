<?php

namespace App\Http\Controllers;

use App\Models\ProductBalance;
use App\Http\Requests\StoreProductBalanceRequest;
use App\Http\Requests\UpdateProductBalanceRequest;
use App\Http\Resources\ProductBalanceResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Message;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductBalanceController extends Controller
{
  public function index(Request $request)
  {
    $query = ProductBalance::query(); 
    $query->where("product_id", request("product_id"));
    $sortField = request('sort_field', 'created_at');
    $sortDirection = request('sort_direction', 'desc');
    $query->orderBy($sortField, $sortDirection)->get();
    if (request("col")) {
      $col = request("col");
    } else {
      $col = 25;
    }
    $product_balance  = $query->paginate($col)->onEachSide(1);
    $balance          = DB::table('product_balances')
      ->where('product_id', request("product_id"))
      ->select(
        DB::raw('SUM(`add`) as total_add'),
        DB::raw('SUM(`reduce`) as total_reduce'),
        DB::raw('SUM(`profit`) as total_profit')
      )->first();
    $remainingBalance = $balance->total_add - $balance->total_reduce;
    $message          = Message::first();
    return inertia("Admin/Financial/ProductBalance/Index", [
      "product_balance"       => ProductBalanceResource::collection($product_balance),
      'total_add_all'         => number_format($balance->total_add),
      'total_reduce_all'      => number_format($balance->total_reduce),
      'total_profit_all'      => number_format($balance->total_profit),
      'final_balance_all'     => number_format($remainingBalance),
      'success'               => session('success'),
      'message'               => $message,
      'queryParams'           => request()->query() ?: null,
    ]);
  }

  public function store(StoreProductBalanceRequest $request)
  {
    $data = $request->validated();
    ProductBalance::create($data);
    return to_route('product.balances.home')->with('success', 'تم إضافة الرصيد بنجاح');
  }

  public function update(UpdateProductBalanceRequest $request, ProductBalance $productBalance)
  {
    $data     = $request->validated();
    $product  = $productBalance->product;
    $productBalance->update($data);
    return to_route('product-balance.index',  ['product_id' => $productBalance->product->id])->with('success', "تم تعديل الايداع لصالح \"$product->name\" بنجاح");
  }

  public function destroy(ProductBalance $productBalance)
  {
    $product = $productBalance->product;
    $productBalance->delete();
    return to_route('product-balance.index',  ['product_id' => $productBalance->product->id])->with('success', "تم حذف الايداع لصالح   \"$product->name\" بنجاح");
  }

  public function indexAll(Request $request)
  {
    $productId      = $request->input('product_id');
    $categoryId     = $request->input('category_id');
    $query          = Product::with(['productBalances', 'category']);
    $sortField      = request('sort_field', 'category_id');
    $sortDirection  = request('sort_direction', 'asc');
    $query->orderBy($sortField, $sortDirection)->get();
    if ($productId) {
      $query->where('id', $productId);
    }
    if ($categoryId) {
      $query->where('category_id', $categoryId);
    }
    if (request("col")) {
      $col = request("col");
    } else {
      $col = 25;
    }
    $products_paginated = $query->orderBy($sortField, $sortDirection)->paginate($col);
    $product_balances   = $products_paginated->getCollection()->map(function ($product) {
      $balances       = $product->productBalances ?? collect(); 
      $total_add      = $balances->sum('add');
      $total_reduce   = $balances->sum('reduce');
      $total_profilt  = $balances->sum('profit');
      $final_balance  = $total_add - $total_reduce;

      return [
        'product'       => $product,
        'total_add'     => $total_add,
        'total_reduce'  => $total_reduce,
        'total_profit'  => number_format($total_profilt),
        'final_balance' => number_format($final_balance),
        'all_balance'   => number_format($final_balance + $total_profilt),
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

    $final_balance_all  = $total_add_all - $total_reduce_all;
    $all_balance_all    = $final_balance_all + $total_profit_all;
    $paginated_product_balances = new \Illuminate\Pagination\LengthAwarePaginator(
      $product_balances,
      $products_paginated->total(),
      $products_paginated->perPage(),
      $products_paginated->currentPage(),
      ['path' => $products_paginated->path()]
    );
    $categories = Category::orderBy('name', 'asc')->get();
    $products   = Product::orderBy('name', 'asc')->get();
    $message    = Message::first();
    return inertia("Admin/Financial/ProductBalance/IndexAll", [
      "product_balances"      => $paginated_product_balances,
      "products"              => ProductResource::collection($products),
      "categories"            => ProductResource::collection($categories),
      'queryParams'           => request()->query() ?: null,
      'total_add_all'         => number_format($total_add_all),
      'total_reduce_all'      => number_format($total_reduce_all),
      'total_profit_all'      => number_format($total_profit_all),
      'final_balance_all'     => number_format($final_balance_all),
      'all_balance_all'       => number_format($all_balance_all),
      'success'               => session('success'),
      'message'               => $message,
    ]);
  }
}
