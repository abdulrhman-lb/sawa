<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Message;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;


class ProfileController extends Controller
{
  public function edit(Request $request): Response
  {
    $message = Message::first();
    return Inertia::render('Profile/Edit', [
      'mustVerifyEmail'       => $request->user() instanceof MustVerifyEmail,
      'success'               => session('success'),
      'updated'               => session('updated'),
      'message'               => $message,
    ]);
  }

  public function update(ProfileUpdateRequest $request): RedirectResponse
  {
    $data   = $request->validated();
    $user   = Auth()->user();
    $image  = $data['image'] ?? null;
    if ($image) {
      if ($user->image && file_exists(public_path($user->image))) {
        unlink(public_path($user->image));
      }
      $NewImageName = Str::random() . '.' . $request->image->extension();
      $request -> image ->move(public_path('/images/profiles/'), $NewImageName);
      $data['image'] = '/images/profiles/'.$NewImageName;
    } else {
      $data['image'] = $user['image'];
    }
    $user->update($data);
    return to_route('profile.edit')->with('success', 'تم تحديث معلومات الملف الشخصي بنجاح');
  }

  public function destroy(Request $request): RedirectResponse
  {
    $request->validate([
      'password' => ['required', 'current_password'],
    ]);
    $user = $request->user();
    Auth::logout();
    $user   ->delete();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return Redirect::to('/');
  }
}
