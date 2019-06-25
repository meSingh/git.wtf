
    <header class="pt-8 pb-12 mb-8 bg-gray-200 shadow-inner">
        <div class="max-w-5xl mx-auto px-3 md:px-0">
            <h2 class="text-3xl mb-1 leading-tight md:leading-snug font-semibold">{{ $post->title }}</h2>

            <div class="block m-0 text-sm text-gray-500">
                Written
                <time datetime="{{ $post->published }}" class="text-gray-600">
                    {{ $post->dateShort }}
                </time>

                by
                @if(isset($post->author['link']) && $post->author['link'] !== '' )
                    <a href="{{ $post->author['link'] }}" target="_blank" rel="noopener" class="text-indigo-400 no-underline hover:text-indigo-600">
                        {{ $post->author['name'] }}
                    </a>
                @else
                    {{ $post->author['name'] }}
                @endif

                in
                <a href="{{ route('category', $post->category) }}" class="text-orange-400 no-underline hover:text-orange-600">
                    {{ $post->category_formated }}
                </a>
            </div>
        </div>
    </header>


    <div class="max-w-5xl mx-auto px-3 md:px-0">
        <div class="content py-6 mb-8 border-0 border-b border-gray-400 border-solid text-lg">
            {!! $post->contents !!}

            @if($post->source)
                <div class="flex justify-center pt-4">
                    <a href="{{ $post->source }}" target="_blank" rel="noopener" class="text-gray-500 no-underline text-sm w-8" title="Content Source">{{ svg('source') }}</a>
                </div>
            @endif
        </div>
    </div>

    <footer class="max-w-5xl mx-auto flex justify-between px-3 md:px-0">
        <div class="tags">
            @foreach($post->tags as $tag)
                <a href="{{ route('tag', $tag) }}" class="inline-block bg-gray-200 no-underline hover:text-purple-400 px-4 py-1 text-sm font-semibold text-gray-800 mb-2 mr-2 border border-gray-400 border-solid">{{ $tag }}</a>
            @endforeach
        </div>

        <a href="https://twitter.com/intent/tweet?text={{ urlencode($post->title) }}&url={{ route('post', $post->slug) }}&&via={{config('me.social.twitter')}}" target="_blank" rel="noopener" class=" text-gray-700 no-underline tweetme">{{ svg('twitter') }} Tweet this article!</a>
    </footer>
