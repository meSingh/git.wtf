@extends('layouts.app')

@section('meta')
    <meta property="og:url"                content="{{ url('/') }}" />
    <meta property="og:type"               content="article" />
    <meta property="og:title"              content="{{ config('me.seo.title') }}" />
    <meta property="og:description"        content="{{ config('me.seo.description') }}" />
    <meta property="og:image"              content="{{ asset('/images/social.png') }}" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="{{ '@' . config('me.social.twitter') }}" />
    <meta name="twitter:title" content="{{ config('me.seo.title') }}" />
    <meta name="twitter:description" content="{{ config('me.seo.description') }}" />
    <meta name="twitter:image" content="{{ asset('/images/social.png') }}" />
@endsection

@section('content')
    <section class="max-w-2xl mx-auto md:pt-5">

        @forelse($posts as $post)
            <article class="bg-white shadow-theme xl:rounded-md mb-8 p-6 post">
                @include('post-content', ['type' => 'list'])
            </article>
        @empty
            <section class="bg-white shadow-theme xl:rounded-md mb-8 p-8 text-center">
                <h3 class="font-normal">No articles found!!</h3>
                <a href="{{ route('home') }}" class="text-sm text-purple-dark hover:text-purple-dark border-2 border-purple py-1 px-2 font-semibold rounded mt-4 inline-block no-underline">« Go Home</a>
            </section>
        @endforelse

        {!! $posts->appends(['query' => $query])->links() !!}
    </section>
@endsection
