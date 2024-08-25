<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('comissions', function (Blueprint $table) {
      $table->id();
      $table->integer('comission_admin');
      $table->integer('comission_super');
      $table->text('notes')->nullable();
      $table->foreignId('user_id')->constrained('users');
      $table->foreignId('officer_id')->constrained('users');
      $table->foreignId('amount_kind_id')->constrained('amount_kinds');
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('comissions');
  }
};
