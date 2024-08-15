<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataKind extends Model
{
    use HasFactory;
    protected $fillable = ['name'];

    public function service1(){
      return $this->hasMany(Service::class,'data_kind_id_1');
    }

    public function service2(){
      return $this->hasMany(Service::class,'data_kind_id_2');
    }

}
