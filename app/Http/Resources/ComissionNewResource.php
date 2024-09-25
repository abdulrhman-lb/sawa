<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComissionNewResource extends JsonResource
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
      'comission_admin'       => $this->comission_admin,
      'comission_super'       => $this->comission_super,
      'notes'           => $this->notes,
      'user_id'         => $this->user_id,
      'user'            => new UserResource($this->user),
      'officer_id'      => $this->officer_id,
      'officer'         => new UserResource($this->officer),
      'amount_kind_id'  => $this->amount_kind_id,
      'amount_kind'     => new AmountKindResource($this->amount_kind),
    ];
  }
}
