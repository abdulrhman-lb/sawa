<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
      'comission_admin' => $this->comission_admin,
      'comission_super' => $this->comission_super,
      'data_kind_1'     => $this->data_kind_1,
      'data_kind_2'     => $this->data_kind_2,
      'notes'           => $this->notes,
      'net'             => $this->net,
      'status'          => $this->status,
      'reject_reson'    => $this->reject_reson,
      'customer_id'     => $this->customer_id,
      'customer'        => new CustomerResource($this->customer),
      'user_id'         => $this->user_id,
      'user'            => new UserResource($this->user),
      'service_id'      => $this->service_id,
      'service'         => new ServiceResource($this->service),
      'amount_kind_id'  => $this->amount_kind_id,
      'amount_kind'     => new AmountKindResource($this->amount_kind),
      'created_at'      => (new Carbon($this->created_at))->format('Y-m-d'),
    ];
  }
}
