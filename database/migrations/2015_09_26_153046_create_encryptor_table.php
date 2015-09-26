<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEncryptorTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('encryptor', function (Blueprint $table) {
            $table->increments('id');
            $table->string('url_key', 32)->unique();
            $table->longText('data');
            $table->dateTime('expires');
            $table->tinyInteger('max_views')->default(0)->unsigned();
            $table->tinyInteger('views')->default(0)->unsigned();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('encryptor');
    }
}
