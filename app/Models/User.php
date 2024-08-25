<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
  use HasFactory, Notifiable;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    'name',
    'email',
    'user_name',
    'password',
    'phone',
    'mobile',
    'address',
    'center',
    'kind',
    'status',
    'email_verified_at',
    'created_by'
  ];


  /**
   * The attributes that should be hidden for serialization.
   *
   * @var array<int, string>
   */
  protected $hidden = [
    'password',
    'remember_token',
  ];

  public function createdBy()
  {
    return $this->belongsTo(User::class, 'created_by');
  }

  public function comission_user(){
    return $this->hasMany(Comission::class, "user_id");
  }

  public function comission_officer(){
    return $this->hasMany(Comission::class, "officer_id");
  }

  public function products(){
      return $this->hasMany(Product::class);
    }

    public function orders(){
      return $this->hasMany(Order::class, 'user_id');
    }
  /**
   * Get the attributes that should be cast.
   *
   * @return array<string, string>
   */
  protected function casts(): array
  {
    return [
      'email_verified_at' => 'datetime',
      'password' => 'hashed',
    ];
  }
}
