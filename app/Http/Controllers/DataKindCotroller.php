<?php

namespace App\Http\Controllers;

use App\Models\DataKind;
use App\Http\Requests\StoreDataKindRequest;
use App\Http\Requests\UpdateDataKindRequest;
use App\Http\Resources\DataKindResource;

class DataKindCotroller extends Controller
{

  public function index()
  {
    $query = DataKind::query();

    // Sorting
    $sortField = request('sort_field', 'created_at');
    $sortDirection = request('sort_direction', 'desc');

    // Search
    if (request("name")) {
      $query->where("name", "like", "%" . request("name") . "%");
    }

    // Apply
    $datakinds = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
    return inertia("Admin/Dashboard/DataKind/Index", [
      "datakinds"    => DataKindResource::collection($datakinds),
      'queryParams' => request()->query() ?: null,
      'success'     => session('success'),
    ]);
  }

  public function create()
  {
    return inertia("Admin/Dashboard/DataKind/Create");
  }

  public function store(StoreDataKindRequest $request)
  {
    $data = $request->validated();
    DataKind::create($data);
    return to_route('datakind.index')->with('success', 'تم إضافة نوع بيانات خدمة بنجاح');
  }

  public function show(DataKind $datakind)
  {
    //
  }

  public function edit(DataKind $datakind)
  {
    // dd($dataKind);
    return inertia("Admin/Dashboard/DataKind/Edit", [
      'dataKind' => new DataKindResource($datakind)
    ]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateDataKindRequest $request, DataKind $datakind)
  {
    //
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(DataKind $datakind)
  {
    // التحقق إذا كان هناك مهام مرتبطة بالتصنيف
    // if ($dataKind->products()->count() > 0) {
    //   return to_route('dataKind.index')->with('success', "لايمكن حذف التصنيف  \"$dataKind->name\" لوجود منتجات مرتبطة به");
    // }

    $name = $datakind->name;
    $datakind->delete();

    return to_route('datakind.index')->with('success', "تم حذف نوع بيانات الخدمة   \"$name\" بنجاح");
  }
}
