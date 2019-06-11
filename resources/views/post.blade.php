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

    <article class="post bg-white relative mb-16 overflow-hidden" style="z-index: 99999;">
        @include('post-content', ['type' => 'single'])
    </article>

    <section class="max-w-5xl mx-auto mb-20d">
        <div class="flex flex-col md:flex-row text-xl px-3 md:px-0">
            <div class="w-full md:w-1/2 border-0 md:border-r border-gray-200 border-solid">
                @if($post->previous)
                    <h3><a href="{{ route('post', $post->previous->slug) }}" class="text-gray-800 hover:text-purple-500 no-underline">
                    <span class="block text-sm text-gray-500">&laquo; Previous Article</span> {{ $post->previous->title }}</a></h3>
                @endif
            </div>
            <div class="w-full md:w-1/2 text-right">
                @if($post->next)
                    <h3><a href="{{ route('post', $post->next->slug) }}" class="text-gray-800 hover:text-purple-500 no-underline"><span class="block text-sm text-gray-500">Next Article &raquo;</span>{{ $post->next->title }} </a></h3>
                @endif
            </div>
        </div>
    </section>

    <section class="bg-gray-200 shadow-theme mb-16 rounded py-10 px-6">
        <div class="max-w-5xl mx-auto">
            <h3 class="mb-0">Want to Contribute?</h3>

            <p class="mb-4">Send me an <a href="mailto:{{ config('me.email') }}?Subject={{ config('me.name') }}">Email</a>, ping me on <a href="https://twitter.com/{{ config('me.social.twitter') }}" class="text-blue-500 hover:text-blue-300">Twitter</a> or submit a pull request on <a href="https://github.com/{{ config('me.social.github') }}/pulls" class="text-orange-400 hover:text-orange-300">Github</a>.</p>
        </div>
    </section>

    <section class="max-w-5xl mx-auto relative mb-16">
        <div id="disqus_thread" style="/*margin-top: -97px;*/overflow: hidden;position: relative;" ></div>
        <script>

        /**
        *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
        *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/

        var disqus_config = function () {
        this.page.url = '{{ url()->current() }}';  // Replace PAGE_URL with your page's canonical URL variable
        this.page.identifier = '{{ $post->slug }}'; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
        };

        (function() { // DON'T EDIT BELOW THIS LINE
        var d = document, s = d.createElement('script');
        s.src = 'https://gitwtf.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
        })();
        </script>
        <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
    </section>


@endsection
