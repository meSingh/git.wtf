<article class="px-10 py-6 bg-white rounded-lg shadow mb-8 post">

    <div class="flex justify-between items-center">
        <time datetime="{{ $post->published }}" class="font-light lowercase text-gray-600">
            {{ $post->dateShort }}
        </time>
        <div class="">
            @foreach($post->tags as $tag)
                <a href="{{ route('tag', $tag) }}" class="px-2 py-1 bg-gray-200 text-gray-800 font-bold rounded hover:bg-gray-500">{{ $tag }}</a>
            @endforeach
        </div>
    </div>

    <div class="mt-3">
        <h2 class="">
            <a href="{{ route('post', $post->slug) }}" class="text-2xl text-gray-700 font-bold hover:text-gray-600">
                {{ $post->title }}
            </a>
        </h2>
        <div class="mt-2 text-gray-600">{!! $post->summary !!}</div>
    </div>

    <div class="flex justify-between items-center mt-4">
        <a href="{{ route('post', $post->slug) }}" class="text-indigo-400 hover:underline">Read more</a>
        <div>
            @if(isset($post->author['link']) && $post->author['link'] !== '' )
                <a class="flex items-center" href="{{ $post->author['link'] }}" target="_blank" rel="noopener">
                    <img class="mx-4 w-10 h-10 object-cover rounded-full hidden sm:block" src="{{ $post->author['avatar'] }}" alt="avatar">
                    <h1 class="text-gray-700 font-bold">{{ $post->author['name'] }}</h1>
                </a>
            @else
                <div class="flex items-center">
                    <img class="mx-4 w-10 h-10 object-cover rounded-full hidden sm:block" src="{{ $post->author['avatar'] }}" alt="avatar">
                    <h1 class="text-gray-700 font-bold">{{ $post->author['name'] }}</h1>
                </div>
            @endif
        </div>
    </div>
    <!-- <a href="{{ route('category', $post->category) }}" class="inline-block text-gray-600 uppercase rounded no-underline hover:underline text-xs uppercase tracking-wider bg-gray-300 font-bold inline-block px-2 py-1 rounded">{{ $post->category_formated }}</a> -->
</article>
