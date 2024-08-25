<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderRequest extends FormRequest
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
      // 'amount'          => ['required', 'integer', 'min:100'],
      // 'comission_admin' => ['required', 'integer', 'min:1'],
      // 'comission_super' => ['nullable', 'integer'],
      // 'net'             => ['required', 'integer'],
      // 'data_kind_1'     => ['required', 'string'],
      // 'data_kind_2'     => ['nullable', 'string'],
      // 'notes'           => ['nullable'],
      'reject_reson'    => ['nullable', 'string'],
      'status'          => ['required', Rule::in(['in_progress', 'completed', 'reject'])], 
      // 'customer_id'     => ['nullable', 'exists:customers,id'],
      // 'service_id'      => ['required', 'exists:services,id'],
      // 'user_id'         => ['required', 'exists:users,id'],
      // 'amount_kind_id'  => ['required', 'exists:amount_kinds,id'],
    ];
  }
}
