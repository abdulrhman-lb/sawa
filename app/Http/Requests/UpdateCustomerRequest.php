<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerRequest extends FormRequest
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
      'name'        => ['required', 'max:255'],
      'notes'       => ['nullable'],
      'mobile'      => ['nullable'],
      'phone'       => ['nullable'],
      'created_by'  => ['required', 'exists:users,id'],
    ];
  }
}
