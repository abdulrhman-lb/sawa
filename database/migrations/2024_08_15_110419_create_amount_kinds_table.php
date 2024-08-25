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
    Schema::create('amount_kinds', function (Blueprint $table) {
      $table->id();
      $table->integer('amount');
      $table->foreignId('service_id')->constrained('services');
      $table->foreignId('kind_id')->nullable()->constrained('kinds');
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('amount_kinds');
  }
};
