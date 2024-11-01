<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'notes', 'mobile', 'phone', 'created_by', 'amount_kind_id'];

    public function orders(){
      return $this->hasMany(Order::class, 'customer_id');
    }
    public function createdBy()
    {
      return $this->belongsTo(User::class, 'created_by');
    }
}
