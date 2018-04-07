<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Spatie\RobotsMiddleware\RobotsMiddleware;

class Robots extends RobotsMiddleware
{
    protected function shouldIndex(Request $request)
    {
        return config('me.extras.robots');
    }
}
