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
    Schema::create('product_balances', function (Blueprint $table) {
      $table->id();
      $table->integer('add');
      $table->integer('reduce');
      $table->integer('profit');
      $table->string('statment');
      $table->foreignId('product_id')->constrained('products');
      $table->foreignId('order_id')->nullable()->constrained('orders');
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('product_balances');
  }
};
