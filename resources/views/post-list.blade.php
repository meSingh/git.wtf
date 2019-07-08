

    <h2 class="m-0 mb-2 md:mb-0">
        <a href="{{ route('post', $post->slug) }}" class="text-brand-alt no-underline block ">
            {{ $post->title }}
        </a>
    </h2>


    <p class="block m-0 text-sm text-gray-500">
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
    </p>



