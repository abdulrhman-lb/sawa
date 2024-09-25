<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }
  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
   */
  public function rules(): array
  {
    return [
      'name'        => ['required', 'string', 'max:255'],
      'email'       => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
      'user_name'   => ['nullable', 'string', 'lowercase', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
      'phone'       => ['nullable', 'string', 'max:255'],
      'mobile'      => ['nullable', 'string', 'max:255'],
      'address'     => ['nullable', 'string', 'max:255'],
      'center'      => ['nullable', 'string', 'max:255'],
      'kind'        => ['required', Rule::in(['admin', 'super_user', 'user'])],
      'status'      => ['required', Rule::in(['active', 'inactive'])],
      'image'       => ['nullable', 'image'],
    ];
  }
}
