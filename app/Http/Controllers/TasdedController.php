<?php

namespace App\Http\Controllers;

use App\Events\TasdedCreated;
use App\Events\TasdedResponse;
use App\Models\Tasded;
use App\Http\Requests\StoreTasdedRequest;
use App\Http\Requests\UpdateTasdedRequest;
use App\Http\Resources\TasdedResource;
use App\Models\Message;
use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;

class TasdedController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
      $message  = Message::first();
      $tasdeds  = Tasded::where('user_id', auth()->user()->id)->orderBy('created_at', 'desc')->paginate(25)->onEachSide(1);
      return Inertia::render('Tasded/Index', [
        'tasdeds'      => TasdedResource::collection($tasdeds),
        'success'      => session('success'),
        'message'      => $message,
      ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function response()
    {
      $tasded = Tasded::where('id', request('id'))->first();
      $tasded->amount = request('amount');
      $tasded->save();
      event(new TasdedResponse($tasded));
      return to_route('tasded.home')->with('success', 'تم الاستجابة لطلب الاستعلام بنجاح');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTasdedRequest $request)
    {
      $data = $request->validated();
      $tasded = Tasded::create($data);
      event(new TasdedCreated($tasded));
      return to_route('tasded.index')->with('success', 'تم إرسال طلب الاستعلام بنجاح');
    }

    /**
     * Display the specified resource.
     */
    public function home()
    {
      $message  = Message::first();
      $currentUserId = auth()->id();
      $query = Tasded::query();
      if (auth()->user()->kind != "admin") {
        $query->join('users', 'tasdeds.user_id', '=', 'users.id')
          ->where(function ($query) use ($currentUserId) {
            $query->where('users.process_order', 1)
              ->where(function ($query) use ($currentUserId) {
                $query->where('users.created_by', '=', $currentUserId)
                  ->orWhere('users.id', '=', $currentUserId);
              });
          })->select('tasdeds.*');
      } else {
        $query->join('users', 'tasdeds.user_id', '=', 'users.id')
          ->where(function ($query) use ($currentUserId) {
            $query->where('users.created_by', '=', $currentUserId)
              ->where('users.kind', '!=', 'super_user')
              ->orwhere('users.process_order', 0)
              ->orWhere('users.id', '=', $currentUserId);
          })->select('tasdeds.*');
      }

      $tasdeds = $query->orderBy('created_at', 'desc')
        ->paginate(25)
        ->onEachSide(1);
      return Inertia::render('Tasded/IndexAll', [
        'tasdeds'      => TasdedResource::collection($tasdeds),
        'success'      => session('success'),
        'message'      => $message,
      ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tasded $tasded)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTasdedRequest $request, Tasded $tasded)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tasded $tasded)
    {
        //
    }
}
