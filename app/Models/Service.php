<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'notes', 'status', 'product_id', 'data_kind_id_1', 'data_kind_id_2', 'kind'];

    public function product(){
      return $this->belongsTo(Product::class);
    }

    public function data_kind_1(){
      return $this->belongsTo(DataKind::class,'data_kind_id_1');
    }

    public function data_kind_2(){
      return $this->belongsTo(DataKind::class,'data_kind_id_2');
    }

    public function amountKins(){
      return $this->hasMany(AmountKind::class, 'service_id');
    }

    public function orders(){
      return $this->hasMany(Order::class, 'service_id');
    }
}
