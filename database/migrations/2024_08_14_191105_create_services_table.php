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
    Schema::create('services', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->enum('kind', ['const', 'var']);
      $table->text('notes')->nullable();
      $table->enum('status', ['active', 'inactive']);
      $table->foreignId('product_id')->constrained('products');
      $table->foreignId('data_kind_id_1')->constrained('data_kinds');
      $table->foreignId('data_kind_id_2')->nullable()->constrained('data_kinds');
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('services');
  }
};
