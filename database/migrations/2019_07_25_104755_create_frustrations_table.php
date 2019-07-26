<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFrustrationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('frustrations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->text('request');
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->boolean('anonymous', false);
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('frustrations');
    }
}
