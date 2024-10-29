<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
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
      'id'          => $this->id,
      'name'        => $this->name,
      'mobile'      => $this->mobile,
      'phone'       => $this->phone,
      'amount_kind_id'       => $this->amount_kind_id,
      'notes'       => $this->notes,
      'created_by'  => $this->created_by,
      'createdBy'   => $this->createdBy,
    ];
  }
}
