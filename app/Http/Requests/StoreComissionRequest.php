<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreComissionRequest extends FormRequest
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
      'comission_admin' => ['required', 'integer'],
      'comission_super' => ['nullable', 'integer'],
      'amount_kind_id'  => ['required', 'exists:amount_kinds,id'],
      'user_id'         => ['required', 'exists:users,id'],
      'officer_id'      => ['required', 'exists:users,id'],
      'notes'           => ['nullable'],

    ];
  }
}
