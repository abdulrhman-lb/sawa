<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AmountKind extends Model
{
    use HasFactory;
    protected $fillable = ['kind_id', 'amount', 'service_id', 'kind'];

    public function service(){
      return $this->belongsTo(Service::class);
    }

    public function kindName(){
      return $this->belongsTo(Kind::class, 'kind_id');
    }

    public function comissions(){
      return $this->hasMany(Comission::class);
    }

    public function orders(){
      return $this->hasMany(Order::class, 'amount_kind_id');
    }
}
