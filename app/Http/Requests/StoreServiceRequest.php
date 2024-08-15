<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServiceRequest extends FormRequest
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
        'name'            => ['required', 'max:255'],
        'notes'           => ['nullable'],
        'status'          => ['required', Rule::in(['active', 'inactive'])],
        'product_id'      => ['required', 'exists:products,id'],
        'data_kind_id_1'  => ['required', 'exists:data_kinds,id'],
        'data_kind_id_2'  => ['nullable', 'exists:data_kinds,id'],
      ];
    }
}
