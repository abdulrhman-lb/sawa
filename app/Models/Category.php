<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'notes', 'image', 'status'];

    public function products(){
      return $this->hasMany(Product::class);
    }

    public function category_permissions(){
      return $this->hasMany(CategoryPermission::class, 'category_id');
    }

}
