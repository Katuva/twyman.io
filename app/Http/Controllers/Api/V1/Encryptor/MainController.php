<?php

namespace app\Http\Controllers\Api\V1\Encryptor;

use App\Encryptor;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MainController extends Controller
{
    /**
     * Save Encryptor data to the database.
     *
     * @param Request $request
     * @return string
     */
    public function store(Request $request)
    {
        $db = new Encryptor();

        $expires = new \DateTime();
        $expires->add(\DateInterval::createFromDateString($request->expires));

        $db->data = $request->data;
        $db->expires = $expires;
        $db->max_views = $request->max_views;

        if ($db->save()) {
            return response()->json([
                'url' => route('EncryptorDecrypt', ['id' => $db->url_key])
            ], 201);
        }

        return response('', 500);
    }

    /**
     * Get Encryptor data from the database specified by the url_key
     *
     * @param string $url_key
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($url_key)
    {
        $db = Encryptor::where('url_key', $url_key)->firstOrFail();

        $db->views++;

        if (($db->max_views > 0) && ($db->views >= $db->max_views)) {
            $db->delete();
        }
        else {
            $db->save();
        }

        return response()->json($db);
    }
}
