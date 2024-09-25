<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryPermissionResource extends JsonResource
{
  public static $wrap = false;

  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'id'              => $this->id,
      'status'          => $this->status,
      'category_id'     => $this->category_id,
      'category'        => new CategoryResource($this->category),
      'user_id'         => $this->user_id,
      'user'            => new UserCrudResource($this->user),
    ];
  }
}
