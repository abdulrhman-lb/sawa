<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AmountKindResource extends JsonResource
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
      'amount'      => $this->amount,
      'service_id'  => $this->service_id,
      'kind'        => $this->kind,
      'service'     => new ServiceResource($this->service),
      'kind_id'     => $this->kind_id,
      'kindName'    => new KindResource($this->kindName),
    ];
  }
}
