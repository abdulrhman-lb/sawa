<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CenterBalanceVirtualResource extends JsonResource
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
        'add'         => $this->add,
        'reduce'      => $this->reduce,
        'statment'    => $this->statment,
        'user_id'     => $this->user_id,
        'user'        => new UserResource($this->user),
        'order_id'    => $this->order_id,
        'order'       => new OrderResource($this->order),
        'created_at'  => (new Carbon($this->created_at))->format('Y-m-d'),
      ];
    }
}
