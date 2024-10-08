<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryPermission extends Model
{
    use HasFactory;
    protected $fillable = ['category_id', 'user_id', 'status'];


    public function category(){
      return $this->belongsTo(Category::class, 'category_id');
    }

    public function user(){
      return $this->belongsTo(User::class, 'user_id');
    }
}
