@extends('layouts.app')

@section('meta')
<meta property="og:url" content="{{ url('/') }}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="{{ config('me.seo.title') }}" />
<meta property="og:description" content="{{ config('me.seo.description') }}" />
<meta property="og:image" content="{{ asset('/images/social.png') }}" />

<meta name="twitter:card" content="summary" />
<meta name="twitter:site" content="{{ '@' . config('me.social.twitter') }}" />
<meta name="twitter:title" content="{{ config('me.seo.title') }}" />
<meta name="twitter:description" content="{{ config('me.seo.description') }}" />
<meta name="twitter:image" content="{{ asset('/images/social.png') }}" />

@endsection

@section('content')
<section class="max-w-screen-lg mx-auto pt-0 md:pt-12 px-6 md:px-12 pb-12 md:pb-20 flex">
    <div class="md:mr-10" style="">
        <h2 class="text-3xl lg:text-4xl leading-tight mt-8 mb-3 text-indigo-400 font-semibold uppercase">
            <span class="text-teal-400">Git</span> is <span class="text-red-400">f!!cking</span> <span class="text-pink-400">hard</span>
        </h2>

        <h4 class="text-2xl leading-tight font-normal text-gray-600">Find solutions to all your git  problems along with tips & tricks to improve your git workflows!</h4>

        <form action="https://khurafatstudio.us13.list-manage.com/subscribe/post?u=00058058733c668eea4891e02&amp;id=d83f6d4784" method="post" class="mt-6 lg:mt-10 flex">
            <input class="rounded-l-lg py-0 px-4 border-t mr-0 border-b border-l text-gray-800 border-gray-300 bg-gray-100 w-full outline-none focus:border-yellow-500 focus:bg-yellow-100 focus:placeholder-yellow-500" placeholder="Get latest tips & tricks right in your inbox" type="email" name="EMAIL"/>
            <input type="hidden" name="LOCATION" value="GIT.WTF!?!">
            <button class="px-4 rounded-r-lg bg-yellow-400  text-gray-800 font-bold py-3 uppercase border-yellow-500 border-t border-b border-r text-sm">Subscribe</button>
        </form>

    </div>
    <img src="/images/fuck.jpg" class="w-1/2 lg:w-2/5 hidden md:block">
</section>

<section class="bg-gray-100 border-t">
<div class="max-w-screen-lg mx-auto md:mt-8 px-2 md:px-12 py-8">

    @forelse($posts as $post)

        @include('post-list', ['type' => 'list'])



    {{--@if( $loop->index == 4)
                <section class="bg-gray-200 my-6 max-w-5xl shadow-inner md:shadow md:rounded py-3 px-6">
                    <h3 class="mb-0">Want to Contribute?</h3>

                    <p class="mb-4">Send me an <a href="mailto:{{ config('me.email') }}?Subject={{ config('me.name') }}">Email</a>, ping me on <a href="https://twitter.com/{{ config('me.social.twitter') }}" target="_blank" rel="noopener" class="text-blue-500 hover:text-blue-300">Twitter</a> or submit a pull request on <a href="https://github.com/{{ config('me.social.github') }}/pulls" target="_blank" rel="noopener" class="text-orange-400 hover:text-orange-300">Github</a>.</p>
</div>
</section>
@endif--}}
@empty
<section class="bg-white shadow-md xl:rounded mb-8 p-8 text-center">
    <h3 class="font-normal">No articles found!!</h3>
    <a href="{{ route('home') }}" class="text-sm text-purple-600 hover:text-purple-600 border-2 border-purple-500 py-1 px-2 font-semibold rounded mt-4 inline-block no-underline">« Go Home</a>
</section>
@endforelse


    {!! $posts->appends(['query' => $query])->links() !!}

</section>
@endsection
