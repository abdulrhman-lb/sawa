<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComissionNew extends Model
{
    use HasFactory;
    protected $fillable = ['comission_admin', 'comission_super', 'amount_kind_id', 'user_id', 'officer_id', 'notes'];

    public function user(){
      return $this->belongsTo(User::class, "user_id");
    }

    public function amount_kind(){
      return $this->belongsTo(AmountKind::class, "amount_kind_id");
    }

    public function officer(){
      return $this->belongsTo(User::class, "officer_id");
    }
}
