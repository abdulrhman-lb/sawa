<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
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
      'name'            => $this->name,
      'status'          => $this->status,
      'notes'           => $this->notes,
      'product_id'      => $this->product_id,
      'product'         => new ProductResource($this->product),
      'data_kind_id_1'  => $this->data_kind_id_1,
      'data_1'     => new DataKindResource($this->data_kind_1),
      'data_kind_id_2'  => $this->data_kind_id_2,
      'data_2'     => new DataKindResource($this->data_kind_2),
    ];
  }
}
