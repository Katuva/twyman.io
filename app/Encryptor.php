<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Encryptor extends Model
{
    protected $table = 'encryptor';

    protected $hidden = ['id'];

    public static function create(array $attributes = [])
    {
        return parent::create(
            array_merge(
                $attributes,
                ['url_key' => str_random(32)]
            )
        );
    }
}
