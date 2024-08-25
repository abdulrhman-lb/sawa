<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable = ['amount', 'comission_admin', 'comission_super', 'net', 'status', 'reject_reson', 'data_kind_1', 'data_kind_2', 'notes', 'customer_id', 'user_id', 'service_id', 'amount_kind_id'];

    public function customer(){
      return $this->belongsTo(Customer::class);
    }

    public function user(){
      return $this->belongsTo(User::class);
    }

    public function service(){
      return $this->belongsTo(Service::class);
    }

    public function amount_kind(){
      return $this->belongsTo(AmountKind::class);
    }

    public function productBalances(){
      return $this->hasMany(ProductBalance::class, 'order_id');
    }
}
