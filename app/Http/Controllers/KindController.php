<?php

namespace App\Http\Controllers;

use App\Models\Kind;
use App\Http\Requests\StoreKindRequest;
use App\Http\Requests\UpdateKindRequest;
use App\Http\Resources\KindResource;

class KindController extends Controller
{
  public function index()
  {
    $query = Kind::query();

    // Sorting
    $sortField = request('sort_field', 'created_at');
    $sortDirection = request('sort_direction', 'desc');

    // Search
    if (request("name")) {
      $query->where("name", "like", "%" . request("name") . "%");
    }

    // Apply
    $kinds = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
    return inertia("Admin/Dashboard/Kind/Index", [
      "kinds"    => KindResource::collection($kinds),
      'queryParams' => request()->query() ?: null,
      'success'     => session('success'),
    ]);
  }

  public function create()
  {
    return inertia("Admin/Dashboard/Kind/Create");
  }

  public function store(StoreKindRequest $request)
  {
    $data = $request->validated();
    Kind::create($data);
    return to_route('kind.index')->with('success', 'تم إضافة تفاصيل الخدمة بنجاح');
  }

  public function show(Kind $kind)
  {
    //
  }

  public function edit(Kind $kind)
  {
    return inertia("Admin/Dashboard/Kind/Edit", [
      'kind' => new KindResource($kind)
    ]);
  }

  public function update(UpdateKindRequest $request, Kind $kind)
  {
    $data = $request->validated();

    $kind->update($data);
    return to_route('kind.index')->with('success', "تم تعديل تفاصيل الخدمة \"$kind->name\" بنجاح");
  }

  public function destroy(Kind $kind)
  {
    //التحقق إذا كان هناك سجلات مرتبطة
    if (($kind->amountKinds()->count() > 0)) {
      return to_route('kind.index')->with('success', "لايمكن حذف بيانات تفاصيل الخدمة  \"$kind->name\" لوجود منتجات مرتبطة به");
    }

    $name = $kind->name;
    $kind->delete();

    return to_route('kind.index')->with('success', "تم حذف تفاصيل الخدمة   \"$name\" بنجاح");
  }
}
