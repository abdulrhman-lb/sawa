<?php

namespace App\Http\Resources;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserCrudResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public static $wrap = false;

  public function toArray(Request $request): array
  {
    return [
      'id'          => $this->id,
      'name'        => $this->name,
      'email'       => $this->email,
      'user_name'   => $this->user_name,
      'phone'       => $this->phone,
      'mobile'      => $this->mobile,
      'center'      => $this->center,
      'kind'        => $this->kind,
      'status'      => $this->status,
      'created_at'  => (new Carbon($this->created_at))->format('Y/m/d'),
      'createdBy'   => $this->createdBy ? $this->createdBy->name : null,
    ];
  }
}