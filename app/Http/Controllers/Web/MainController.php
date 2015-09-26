<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;

class MainController extends Controller
{
    public function index()
    {
        return view('web.index');
    }
}
