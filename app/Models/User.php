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
    'user_balance',
    'add_balance',
    'email_verified_at',
    'created_by',
    'image',
    'process_order'
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

  public function officers()
  {
    return $this->hasMany(User::class, 'created_by');
  }

  public function customers()
  {
    return $this->hasMany(Customer::class, 'created_by');
  }

  public function comission_user()
  {
    return $this->hasMany(Comission::class, "user_id");
  }

  public function comission_new_user()
  {
    return $this->hasMany(ComissionNew::class, "user_id");
  }

  public function comission_new_officer()
  {
    return $this->hasMany(ComissionNew::class, "officer_id");
  }

  public function comission_officer()
  {
    return $this->hasMany(Comission::class, "officer_id");
  }

  public function products()
  {
    return $this->hasMany(Product::class);
  }

  public function orders()
  {
    return $this->hasMany(Order::class, 'user_id');
  }

  public function tasdeds()
  {
    return $this->hasMany(Tasded::class, 'user_id');
  }

  public function category_permissions()
  {
    return $this->hasMany(CategoryPermission::class, 'user_id');
  }

  public function centerBalances()
  {
    return $this->hasMany(CenterBalance::class, 'user_id');
  }

  public function centerBalanceVirtuals()
  {
    return $this->hasMany(CenterBalanceVirtual::class, 'user_id');
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
