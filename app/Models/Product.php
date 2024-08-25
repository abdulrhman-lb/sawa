<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'notes', 'image', 'status', 'phone', 'category_id'];

    public function category(){
      return $this->belongsTo(Category::class);
    }

    public function services(){
      return $this->hasMany(Service::class);
    }

    public function productBalances(){
      return $this->hasMany(ProductBalance::class, 'product_id');
    }
}
