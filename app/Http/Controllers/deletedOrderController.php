<?php

namespace App\Http\Controllers;

use App\Models\deletedOrder;
use App\Http\Requests\StoredeletedOrderRequest;
use App\Http\Requests\UpdatedeletedOrderRequest;
use App\Http\Resources\deletedOrderResource;
use App\Http\Resources\UserResource;
use App\Models\Message;
use App\Models\User;
use Carbon\Carbon;

class deletedOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function deleted()
    {
      $start_date = request("date");
      $end_date = request("date");
      $start_date = $start_date ? Carbon::createFromFormat('d/m/Y', $start_date)->startOfDay() : now()->startOfDay();
      $end_date = $end_date ? Carbon::createFromFormat('d/m/Y', $end_date)->endOfDay() : now()->endOfDay();
  
      $currentUserId  = auth()->id();
      $query          = deletedOrder::query();
  
      if (auth()->user()->kind != "admin") {
        $query->join('users', 'deleted_orders.user_id', '=', 'users.id')
          ->where(function ($query) use ($currentUserId) {
            $query->where('users.created_by', '=', $currentUserId)
              ->orWhere('users.id', '=', $currentUserId);
          })
          ->select('deleted_orders.*');
        $users = User::where('created_by', $currentUserId)->orWhere('id', '=', $currentUserId)->orderBy('name', 'asc')->get();
      } else {
        $users = User::orderBy('name', 'asc')->get();
      }
      $sortField = request('sort_field', 'created_at');
      $sortDirection = request('sort_direction', 'desc');
      if (request("data_kind_1")) {
        $query->where("data_kind_1", "like", "%" . request("data_kind_1") . "%");
      }
      if (request("user_id")) {
        $query->where("user_id", request("user_id"));
      }
      if (request("status")) {
        $query->where("status", request("status"));
      }
      if (request("col")) {
        $col = request("col");
      } else {
        $col = 25;
      }
      $query->whereBetween("deleted_orders.created_at", [$start_date, $end_date]);
      $orders = $query->orderBy($sortField, $sortDirection)
        ->paginate($col)
        ->onEachSide(1);
      $message = Message::first();
      return inertia("Order/Deleted", [
        "orders"                => deletedOrderResource::collection($orders),
        "users"                 => UserResource::collection($users),
        'queryParams'           => request()->query() ?: null,
        'success'               => session('success'),
        'message'               => $message
      ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoredeletedOrderRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(deletedOrder $deletedOrder)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(deletedOrder $deletedOrder)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatedeletedOrderRequest $request, deletedOrder $deletedOrder)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(deletedOrder $deletedOrder)
    {
        //
    }
}
