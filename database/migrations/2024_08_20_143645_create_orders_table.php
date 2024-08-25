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
    Schema::create('orders', function (Blueprint $table) {
      $table->id();
      $table->integer('amount');
      $table->integer('comission_admin');
      $table->integer('comission_super');
      $table->integer('net');
      $table->enum('status', ['in_progress', 'completed', 'reject']);
      $table->string('reject_reson')->nullable();
      $table->string('data_kind_1');
      $table->string('data_kind_2')->nullable();
      $table->test('notes')->nullable();
      $table->foreignId('customer_id')->nullable()->constrained('customers');
      $table->foreignId('user_id')->constrained('users');
      $table->foreignId('service_id')->constrained('services');
      $table->foreignId('amount_kind_id')->constrained('amount_kinds');
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('orders');
  }
};
