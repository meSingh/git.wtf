<h2 class="m-0 mb-2 md:mb-0">
    <a href="{{ route('post', $post->slug) }}" class="text-brand-alt text-2xl no-underline block ">
        {{ $post->title }}
    </a>
</h2>


<!-- <p class="block m-0 text-sm text-gray-500">
    Written
    <time datetime="{{ $post->published }}" class="text-gray-600 font-semibold tracking-tight">
        {{ $post->dateShort }}
    </time>

    by
    @if(isset($post->author['link']) && $post->author['link'] !== '' )
    <a href="{{ $post->author['link'] }}" target="_blank" rel="noopener" class="text-brand no-underline hover:text-indigo-600">
        {{ $post->author['name'] }}
    </a>
    @else
    {{ $post->author['name'] }}
    @endif

    in
    <a href="{{ route('category', $post->category) }}" class="text-orange-600 no-underline hover:text-orange-600">
        {{ $post->category_formated }}
    </a>
</p> -->
<p>{!! $post->summary_short_formated !!}</p>

<p class="block m-0 text-gray-500 font-normal">
    @if(isset($post->author['link']) && $post->author['link'] !== '' )
    <a href="{{ $post->author['link'] }}" target="_blank" rel="noopener" class="no-underline text-brand">
        {{ $post->author['name'] }}
    </a>
    @else
    {{ $post->author['name'] }}
    @endif

    {{ svg('minus') }}

    <time datetime="{{ $post->published }}" class="text-gray-700 mr-6">
        {{ $post->dateShort }}
    </time>

    <span class="tags block md:inline-block">
        @foreach($post->tags as $tag)

        <span class="mr-1">

            <a href="{{ route('tag', $tag) }}" class="inline-block text-red-700 uppercase rounded no-underline hover:underline text-sm font-medium">{{ $tag }}</a>

            ,</span>

        @endforeach

                    <a href="{{ route('category', $post->category) }}" class="inline-block text-red-700 uppercase rounded no-underline hover:underline text-sm font-medium">{{ $post->category_formated }}</a>
    </span>
    <!-- <a href="{{ route('category', $post->category) }}" class="text-orange-400 no-underline hover:text-orange-600">
            {{ $post->category_formated }}
        </a> -->
</p>

@if( !$loop->last )
<hr class="bg-gray-200 border-gray-400 border-solid mx-20 mt-16">
@endif