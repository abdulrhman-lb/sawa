<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
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
        $user = $this->route('user');
        return [
          'name'        => ['required', 'string', 'max:255'],
          'email'       => ['required', 'string', 'email', Rule::unique('users')->ignore($user->id)], 
          'password'    => ['nullable', Password::min(8), 'confirmed'],
          'user_name'   => ['required', 'string', 'lowercase', 'max:255', Rule::unique('users')->ignore($user->id)],
          'phone'       => ['nullable', 'string', 'max:255'],
          'mobile'      => ['nullable', 'string', 'max:255'],
          'address'     => ['nullable', 'string', 'max:255'],
          'center'      => ['nullable', 'string', 'max:255'],
          'kind'        => ['required', Rule::in(['admin', 'super_user', 'user'])],
          'status'      => ['required', Rule::in(['active', 'inactive'])],
          'created_by'  => ['required', 'exists:users,id'],

        ];
    }
}
