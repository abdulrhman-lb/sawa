<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductBalanceRequest extends FormRequest
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
      'add'         => ['required', 'integer'],
      'reduce'      => ['required', 'integer'],
      'profit'      => ['required', 'integer'],
      'statment'    => ['required', 'string'],
      'product_id'  => ['required', 'exists:products,id'],
      'order_id'    => ['nullable', 'exists:orders,id'],
    ];
  }
}