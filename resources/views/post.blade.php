@extends('layouts.app')

@section('meta')
<meta property="og:url" content="{{ url()->current() }}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="{{ $post->title }}" />
<meta property="og:description" content="{{ $post->summary_short }}" />
<meta property="og:image" content="{{ $post->preview_image }}" />

<meta name="twitter:card" content="summary" />
<meta name="twitter:site" content="{{ '@'. config('me.social.twitter') }}" />
<meta name="twitter:title" content="{{ $post->title }}" />
<meta name="twitter:description" content="{{ $post->summary_short }}" />
<meta name="twitter:image" content="{{ $post->preview_image }}" />
@endsection

@section('content')

@if($post->type != 'page')
<article class="post bg-white pb-10 overflow-hidden leading-relaxed  bg-gray-100 ">
@else
<article class="post bg-white pb-10 overflow-hidden leading-relaxed  bg-white ">
@endif
    @include('post-content', ['type' => 'single'])
</article>

@if($post->type != 'page')


<section class="bg-white border-t pt-12">
    <div class=" max-w-screen-lg px-3 md:px-12 mx-auto relative pb-12">
    <div id="disqus_thread" style="overflow: hidden;position: relative;" class="px-4"></div>
    </div>
</section>


<section class="bg-white pb-12 pt-10 px-2 md:px-6 hidden">
    <div class="max-w-screen-lg px-12 mx-auto">

        <div class="flex flex-col md:flex-row text-xl px-3 md:px-0 leading-tight">
            <div class="w-full md:w-1/2 border-0 md:border-r border-gray-300 border-solid pr-4">
                @if($post->previous)
                <h3>
                    <a href="{{ route('post', $post->previous->slug) }}" class="text-gray-800 no-underline block">
                        <span class="block text-sm text-gray-500">&laquo; Previous Article</span> {{ $post->previous->title }}
                    </a>
                </h3>
                @endif
            </div>
            <div class="w-full md:w-1/2 text-right pl-4">
                @if($post->next)
                <h3>
                    <a href="{{ route('post', $post->next->slug) }}" class="text-gray-800 no-underline block">
                        <span class="block text-sm text-gray-500">Next Article &raquo;</span>{{ $post->next->title }}
                    </a>
                </h3>
                @endif
            </div>
        </div>

    </div>
</section>
@endif

@endsection

@section('javascript')

<script>
    var disqus_config = function() {
        this.page.url = '{{ url()->current() }}';
        this.page.identifier = '{{ $post->slug }}';
    };

    (function() {
        var d = document,
            s = d.createElement('script');
        s.src = 'https://gitwtf.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    })();
</script>

@endsection
