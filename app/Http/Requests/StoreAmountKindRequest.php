<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAmountKindRequest extends FormRequest
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
      'amount'      => ['required', 'integer'],
      'kind'        => ['required', Rule::in(['const', 'var'])],
      'kind_id'     => ['nullable', 'exists:kinds,id'],
      'service_id'  => ['required', 'exists:services,id'],
    ];
  }
}
