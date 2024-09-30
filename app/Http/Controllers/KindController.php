<?php

namespace App\Http\Controllers;

use App\Models\Kind;
use App\Http\Requests\StoreKindRequest;
use App\Http\Requests\UpdateKindRequest;
use App\Http\Resources\KindResource;
use App\Models\Message;

class KindController extends Controller
{
  public function index()
  {
    $query          = Kind::query();
    $sortField      = request('sort_field', 'created_at');
    $sortDirection  = request('sort_direction', 'desc');
    if (request("name")) {
      $query->where("name", "like", "%" . request("name") . "%");
    }
    if (request("col")) {
      $col = request("col");
    } else {
      $col = 25;
    }
    $kinds = $query->orderBy($sortField, $sortDirection)->paginate($col)->onEachSide(1);
    $message = Message::first();
    return inertia("Admin/Dashboard/Kind/Index", [
      "kinds"                 => KindResource::collection($kinds),
      'queryParams'           => request()->query() ?: null,
      'success'               => session('success'),
      'message'               => $message,
      'initialNotifications'  => auth()->user()->unreadNotifications,
    ]);
  }

  public function create()
  {
    $message = Message::first();
    return inertia("Admin/Dashboard/Kind/Create",[
      'message'               => $message,
      'initialNotifications'  => auth()->user()->unreadNotifications,
    ]);
  }

  public function store(StoreKindRequest $request)
  {
    $data = $request->validated();
    Kind::create($data);
    return to_route('kind.index')->with('success', 'تم إضافة تفاصيل الخدمة بنجاح');
  }

  public function edit(Kind $kind)
  {
    $message = Message::first();
    return inertia("Admin/Dashboard/Kind/Edit", [
      'kind'                  => new KindResource($kind),
      'message'               => $message,
      'initialNotifications'  => auth()->user()->unreadNotifications,
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
    if (($kind->amountKinds()->count() > 0)) {
      return to_route('kind.index')->with('success', "لايمكن حذف بيانات تفاصيل الخدمة  \"$kind->name\" لوجود منتجات مرتبطة به");
    }
    $name = $kind->name;
    $kind->delete();
    return to_route('kind.index')->with('success', "تم حذف تفاصيل الخدمة   \"$name\" بنجاح");
  }
}
