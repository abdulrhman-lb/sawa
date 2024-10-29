<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TasdedResource extends JsonResource
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
      'amount'          => $this->amount,
      'phone'           => $this->phone,
      'user_id'         => $this->user_id,
      'status'         => $this->status,
      'user'            => new UserResource($this->user),
    ];
  }
}
