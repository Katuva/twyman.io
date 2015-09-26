<?php

namespace app\Http\Controllers\Encryptor;

use App\Http\Controllers\Controller;

class MainController extends Controller
{
    public function create()
    {
        return view('encryptor.encrypt');
    }
}
