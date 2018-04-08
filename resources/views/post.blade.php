@extends('layouts.app')

@section('meta')
    <meta property="og:url"                content="{{ url()->current() }}" />
    <meta property="og:type"               content="article" />
    <meta property="og:title"              content="{{ $post->title }}" />
    <meta property="og:description"        content="{{ $post->summary_short }}" />
    <meta property="og:image"              content="{{ $post->preview_image }}" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="{{ '@'. config('me.social.twitter') }}" />
    <meta name="twitter:title" content="{{ $post->title }}" />
    <meta name="twitter:description" content="{{ $post->summary_short }}" />
    <meta name="twitter:image" content="{{ $post->preview_image }}" />
@endsection

@section('content')

    <section class="max-w-2xl mx-auto md:pt-5 post">
        <article class="mb-6">
            @include('post-content', ['type' => 'single'])
        </article>

        <div class="flex flex-col lg:flex-row py-8 my-4 lg:my-10 text-xl mx-4 lg:mx-auto">
            <div class="w-full lg:w-1/2 b-r my-6 lg:my-10">
                @if($post->previous)
                    <h3><a href="{{ route('post', $post->previous->slug) }}" class="text-grey-darker hover:text-purple no-underline">&laquo; {{ $post->previous->title }}</a></h3>
                @endif
            </div>
            <div class="w-full lg:w-1/2 b-r my-6 lg:my-10 text-right">
                @if($post->next)
                    <h3><a href="{{ route('post', $post->next->slug) }}" class="text-grey-darker hover:text-purple no-underline">{{ $post->next->title }} &raquo;</a></h3>
                @endif
            </div>
        </div>

        <div id="hypercomments_widget" class="mx-4 lg:mx-auto"></div>
        <script type="text/javascript">
        document.addEventListener('turbolinks:load', () => {
            _hcwp = window._hcwp || [];
            _hcwp.push({widget:"Stream", widget_id: 103313});
            (function() {
            if("HC_LOAD_INIT" in window)return;
            HC_LOAD_INIT = true;
            var lang = (navigator.language || navigator.systemLanguage || navigator.userLanguage || "en").substr(0, 2).toLowerCase();
            var hcc = document.createElement("script"); hcc.type = "text/javascript"; hcc.async = true;
            hcc.src = ("https:" == document.location.protocol ? "https" : "http")+"://w.hypercomments.com/widget/hc/103313/"+lang+"/widget.js";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hcc, s.nextSibling);
            })();
        });
        </script>
    </section>



@endsection
