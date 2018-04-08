    <header class="mb-1">
        @if( $type == 'single')
            <h2 class="text-3xl mx-6 lg:mx-auto">{{ $post->title }}</h2>
        @else
            <h2>
                <a href="{{ route('post', $post->slug) }}" class="text-black no-underline block hover:text-purple-light">
                    {{ $post->title }}
                </a>
            </h2>
        @endif
    </header>

    <div class="block mb-6 text-sm text-grey {{ $type == 'single' ? 'mx-6 lg:mx-auto' : ''}}">
        <time datetime="{{ $post->published }}" class="">
            {{ $post->dateShort }}
        </time>
        <span class="text-lg mx-2">&middot;</span>
        @if(isset($post->author['link']) && $post->author['link'] !== '' )
            <a href="{{ $post->author['link'] }}" target="_blank" class="text-grey no-underline hover:text-purple">
                {{ $post->author['name'] }}
            </a>
        @else
            {{ $post->author['name'] }}
        @endif

        <span class="text-lg mx-2">&middot;</span>
        {{ $post->category }}
    </div>


    <div class="{{ $type == 'single' ? 'bg-white shadow-theme xl:rounded-md mb-4 p-6 mt-8' : '' }}">
        <div class="text-grey-darker leading-tight content">
            {!! $post->contents !!}
        </div>

        @if( $type == 'list')
            <div class="pt-4 min-h-80px">
                @foreach($post->tags as $tag)
                    <a href="javascript::void(0)" class="inline-block bg-grey-lighter rounded-md no-underline hover:text-purple-light px-3 py-1 text-sm font-semibold text-grey-darker mr-2">{{ $tag }}</a>
                @endforeach
            </div>
        @endif
    </div>

    @if( $type == 'single')
        <div class="pt-4 min-h-80px mx-4 lg:mx-auto">
            @foreach($post->tags as $tag)
                <a href="javascript::void(0)" class="inline-block bg-white rounded-md no-underline hover:text-purple-light px-3 py-1 text-sm font-semibold text-grey-darker mr-2">{{ $tag }}</a>
            @endforeach
        </div>
    @endif
