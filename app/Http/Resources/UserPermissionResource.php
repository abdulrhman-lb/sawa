<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserPermissionResource extends JsonResource
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
        'user_balance' => $this->user_balance,
        'add_balance' => $this->add_balance,
        'status'      => $this->status,
        'created_by'  => $this->created_by,
        'process_order' => $this->process_order,
        'created_at'  => (new Carbon($this->created_at))->format('Y/m/d'),
        'createdBy'   => $this->createdBy ? $this->createdBy->name : null,
        'image'       => $this->image ? url($this->image) : url('images/profiles/noimage.jpg'),
        'category_permissions' => $this->category_permissions->map(function ($permission) {
          return [
            'id' => $permission->id,
            'category_name' => $permission->category_name,
            'status' => $permission->status,
          ];
        }),
      ];
    }
}
