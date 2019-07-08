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
    <section class="pt-1 pb-8 mb-16 bg-gray-200 border-0 border-b border-solid border-gray-300">
        <div class="max-w-5xl mx-auto px-4 md:px-0">

            <!-- <h2 class="text-4xl text-brand leading-snug text-center">Git What The Fuck !?!</h2> -->
            <h2 class="text-3xl leading-snug"><span class="text-brand">Git is fucking hard,</span> no matter how good you get, there always comes a time when you get stuck & can't figure out a solution!</h2>
            <p>It's easy to get started, but remembering everything that it has to offer is just not practical. On top of that, git documentation is shit; you can't find anything there. If you think you can, you wouldn't be here looking for answers!</p>

            <p class="mb-8">Let's be real, the best place to find any solution for our git problems is <strong>StackOverflow</strong>, and honestly, it does have most of the answers, but we sure can do better, and that is what <span class="text-brand font-bold">Git.WTF</span> is trying to do with a curated list of several of these <i class="underline">problems</i>, <i class="underline">frustrations</i>, and <i class="underline">tricks</i> that can give you a solution in seconds.</p>
            <!-- <div class="flex justify-center"> -->
                <!-- <a href="{{ route('post', $first->slug) }}" class="bg-indigo-500 hover:bg-indigo-700 w-full md:w-1/3 text-white py-3 font-semibold rounded inline-block text-center hover:text-white no-underline border-none text-base cursor-pointer cta-button-home shadow-md">Get solutions to your GIT problems!</a> -->
            <!-- </div> -->
        </div>
    </section>

    <section class="max-w-5xl mx-auto pb-1">

        @forelse($posts as $post)
            <article class="mb-4 py-4 px-4 md:px-0 post leading-snug md:leading-relaxed">
                @include('post-list', ['type' => 'list'])
            </article>


            {{--@if( $loop->index == 4)
                <section class="bg-gray-200 my-6 max-w-5xl shadow-inner md:shadow md:rounded py-3 px-6">
                    <h3 class="mb-0">Want to Contribute?</h3>

                    <p class="mb-4">Send me an <a href="mailto:{{ config('me.email') }}?Subject={{ config('me.name') }}">Email</a>, ping me on <a href="https://twitter.com/{{ config('me.social.twitter') }}" target="_blank" rel="noopener" class="text-blue-500 hover:text-blue-300">Twitter</a> or submit a pull request on <a href="https://github.com/{{ config('me.social.github') }}/pulls" target="_blank" rel="noopener" class="text-orange-400 hover:text-orange-300">Github</a>.</p>

                </section>
            @endif--}}
        @empty
            <section class="bg-white shadow-md xl:rounded mb-8 p-8 text-center">
                <h3 class="font-normal">No articles found!!</h3>
                <a href="{{ route('home') }}" class="text-sm text-purple-600 hover:text-purple-600 border-2 border-purple-500 py-1 px-2 font-semibold rounded mt-4 inline-block no-underline">« Go Home</a>
            </section>
        @endforelse

        <div class="mb-12">
            {!! $posts->appends(['query' => $query])->links() !!}
        </div>
    </section>
@endsection
