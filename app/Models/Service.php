<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'notes', 'status', 'product_id', 'data_kind_id_1', 'data_kind_id_2'];

    public function product(){
      return $this->belongsTo(Product::class);
    }

    public function data_kind_1(){
      return $this->belongsTo(DataKind::class,'data_kind_id_1');
    }

    public function data_kind_2(){
      return $this->belongsTo(DataKind::class,'data_kind_id_2');
    }
}
