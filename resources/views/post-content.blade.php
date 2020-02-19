

    @if($post->type != 'page')
        <header class=" md:pt-4 pb-6  bg-white ">
        <div class="max-w-screen-lg mx-auto px-4 md:px-12 p-4 ">
            <h2 class="text-4xl mb-1 leading-tight md:leading-snug font-semibold">{{ $post->title }}</h2>
            <p class="block m-0 text-sm text-gray-500">
                Written on
                <time datetime="{{ $post->published }}" class="text-teal-400 font-semibold tracking-tight">
                    {{ $post->dateShort }}
                </time>

                by
                @if(isset($post->author['link']) && $post->author['link'] !== '' )
                    <a href="{{ $post->author['link'] }}" target="_blank" rel="noopener" class="text-blue-400 no-underline ">
                        {{ $post->author['name'] }}
                    </a>
                @else
                    {{ $post->author['name'] }}
                @endif

                in
                <a href="{{ route('category', $post->category) }}" class="text-orange-400 no-underline hover:text-orange-600">
                    {{ $post->category_formated }}
                </a>
            </p>
            <!-- <hr class="bg-gray-100 border-gray-300 border-solid mb-6 mt-8"> -->
            </div>
        </header>
    @endif

<div class="   border-t">


    <div class="max-w-screen-lg mx-auto pt-8 px-4 md:px-12">
    @if($post->type != 'page')
        <div class="content pt-1 pb-6 mb-6 border-0 border-b border-gray-300 border-solid text-lg">
    @else
        <div class="content pt-1 text-lg">

    @endif
            {!! $post->contents !!}


        </div>
    </div>

@if($post->type != 'page')
    <footer class="max-w-screen-lg mx-auto px-4 md:px-12 flex flex-col md:flex-row md:justify-between">
        <div class="tags mb-8 md:mb-2">
            @foreach($post->tags as $tag)
                <a href="{{ route('tag', $tag) }}" class="inline-block text-gray-600 uppercase rounded no-underline hover:bg-gray-800 hover:text-gray-200 text-xs uppercase font-bold tracking-wider bg-gray-300 inline-block px-2 py-1 rounded ">{{ $tag }}</a>
            @endforeach
        </div>

        @if($post->source)
                <div class="flex justify-center">
                    <a href="{{ $post->source }}" target="_blank" rel="noopener" class="text-red-400 no-underline text-sm w-8" title="Content Source">{{ svg('source') }}</a>
                </div>
            @endif

        <a href="https://twitter.com/intent/tweet?text={{ urlencode($post->title) }}&url={{ route('post', $post->slug) }}&&via={{config('me.social.twitter')}}" target="_blank" rel="noopener" class=" text-blue-400 hover:text-blue-600 no-underline tweetme">{{ svg('twitter2') }} Tweet me!</a>

    </footer>
@endif
 </div>
