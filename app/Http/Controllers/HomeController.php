<?php

namespace App\Http\Controllers;

use App\Content\Posts;
use Illuminate\Http\Request;

class HomeController
{
    public function index(Posts $posts, Request $request)
    {
        $posts = $request->has('query')
            ? $posts->search($request->get('query'))->paginate(4)
            : $posts->paginate(4);

        return view('home', [
            'posts' => $posts,
            'query' => $request->get('query') ?? null
        ]);
    }

    public function show($slug, Posts $posts)
    {
        $post = $posts->find($slug);

        return view('post', [
            'post' => $post,
            'title' => $post->title
        ]);
    }
}
