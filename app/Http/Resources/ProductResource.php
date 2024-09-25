<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductResource extends JsonResource
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
      'image'       => url($this->image),
      'status'      => $this->status,
      'phone'       => $this->phone,
      'notes'       => $this->notes,
      'category_id' => $this->category_id,
      'category'    => new CategoryResource($this->category),
    ];
  }
}
