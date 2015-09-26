<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', 'Web\MainController@index');
Route::get('/encryptor/encrypt', 'Encryptor\MainController@create');
Route::get('/encryptor/decrypt', [
    'as' => 'EncryptorDecrypt',
    'uses' =>'Encryptor\MainController@show'
]);

// RESTful routes v1
Route::group(['prefix' => 'api/v1', 'namespace' => 'Api\V1'], function () {
    Route::resource('encryptor', 'Encryptor\MainController',
        ['only' => ['show', 'create']]);
});
