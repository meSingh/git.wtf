<?php

namespace App\Http\Controllers;

use App\Content\Posts;
use App\Frustrations;
use Illuminate\Http\Request;

class HomeController
{
    public function index(Posts $posts, Request $request)
    {
        $posts = $request->has('query')
            ? $posts->notAPage()->search($request->get('query'))->paginate(5)
            : $posts->notAPage()->paginate(5);

        return view('home', [
            'posts' => $posts,
            'first' => $posts->first(),
            'query' => $request->get('query') ?? null
        ]);
    }

    public function frustrations(Frustrations $frustrations)
    {
        return view('frustrations', [
            'frustrations' => $frustrations->get(),
            'title' => "Git Frustrations"
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

    public function tag($slug, Posts $posts, Request $request)
    {
        $post = $posts->tag($slug)->paginate(5);

        return view('tag-index', [
            'posts' => $post,
            'title' => $slug,
            'query' => $request->get('query') ?? null
        ]);
    }

    public function category($slug, Posts $posts, Request $request)
    {
        $post = $posts->category($slug)->paginate(5);

        return view('category-index', [
            'posts' => $post,
            'title' => ucwords(str_replace('-', ' ', $slug)),
            'query' => $request->get('query') ?? null
        ]);
    }
}
