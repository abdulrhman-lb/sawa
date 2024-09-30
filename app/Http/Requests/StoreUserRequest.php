<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return true;
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
   */
  public function rules(): array
  {
    return [
      'name'        => ['required', 'string', 'max:255'],
      'email'       => ['required', 'string', 'email', 'unique:users,email'],
      'password'    => ['required', Password::min(8), 'confirmed'],
      'user_name'   => ['nullable', 'string', 'lowercase', 'max:255', 'unique:users,user_name'],
      'phone'       => ['nullable', 'string', 'max:255'],
      'mobile'      => ['required', 'string', 'size:9'],
      'address'     => ['nullable', 'string', 'max:255'],
      'center'      => ['nullable', 'string', 'max:255'],
      'created_by'  => ['required', 'integer'],
      'kind'        => ['required', Rule::in(['admin', 'super_user', 'user'])],
      'status'      => ['required', Rule::in(['active', 'inactive'])],
      'created_by'  => ['required', 'exists:users,id'],
      'image'       => ['nullable', 'image'],
      'process_order'       => ['required'],
    ];
  }
}
