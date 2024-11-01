<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CenterBalance extends Model
{
    use HasFactory;
    protected $fillable = ['add', 'reduce', 'statment', 'user_id', 'order_id', 'profit', 'product_id'];

    public function user()
    {
      return $this->belongsTo(User::class, 'user_id');
    }

    public function order()
    {
      return $this->belongsTo(Order::class, 'order_id');
    }
}
