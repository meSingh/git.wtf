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
    <section class="pt-8 pb-12 mb-8 bg-gray-200">
        <div class="max-w-5xl mx-auto px-3 md:px-0">

            <h2 class="text-3xl">Category: {{ $title  }}</p>
        </div>
    </section>

    <section class="max-w-5xl mx-auto">

        @forelse($posts as $post)
            <article class="mb-2 py-4 px-3 post">
                @include('post-list', ['type' => 'list'])
            </article>


            @if( $loop->index == 4)
                <section class="bg-gray-200 shadow-theme my-6 max-w-5xl rounded py-3 px-6">
                    <h3 class="mb-0">Want to Contribute?</h3>

                    <p class="mb-4">Send me an <a href="mailto:{{ config('me.email') }}?Subject={{ config('me.name') }}">Email</a>, ping me on <a href="https://twitter.com/{{ config('me.social.twitter') }}" class="text-blue-500 hover:text-blue-300">Twitter</a> or submit a pull request on <a href="https://github.com/{{ config('me.social.github') }}/pulls" class="text-orange-400 hover:text-orange-300">Github</a>.</p>

                </section>
            @endif
        @empty
            <section class="bg-white shadow-theme xl:rounded mb-8 p-8 text-center">
                <h3 class="font-normal">No articles found!!</h3>
                <a href="{{ route('home') }}" class="text-sm text-purple-600 hover:text-purple-600 border-2 border-purple-500 py-1 px-2 font-semibold rounded mt-4 inline-block no-underline">« Go Home</a>
            </section>
        @endforelse

        <div class="mb-12">
            {!! $posts->appends(['query' => $query])->links() !!}
        </div>
    </section>
@endsection
