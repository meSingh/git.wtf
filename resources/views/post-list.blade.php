<article class="mb-8 p-4 md:p-8 post leading-snug md:leading-relaxed bg-white rounded-lg shadow">

<h2 class="m-0 mb-2 md:mb-0">
    <a href="{{ route('post', $post->slug) }}" class="text-indigo-900 text-2xl no-underline block ">
        {{ $post->title }}
    </a>
</h2>

<div class=" flex flex-col md:flex-row">
<div class="pr-12">

<div class="my-2">{!! $post->summary !!}</div>

<p class="block m-0 text-gray-500 font-normal">


    <!-- {{ svg('minus') }} -->



    <span class="tags mb-2 md:mb-0 block md:inline-block">
        @foreach($post->tags as $tag)

        <span class="mr-1">

            <a href="{{ route('tag', $tag) }}" class="inline-block text-gray-600 uppercase rounded no-underline hover:underline text-xs uppercase font-bold tracking-wider bg-gray-300 inline-block px-2 py-1 rounded mb-1 md:mb-0">{{ $tag }}</a>
        </span>

        @endforeach

                    <a href="{{ route('category', $post->category) }}" class="inline-block text-gray-600 uppercase rounded no-underline hover:underline text-xs uppercase tracking-wider bg-gray-300 font-bold inline-block px-2 py-1 rounded">{{ $post->category_formated }}</a>
    </span>
    <!-- <a href="{{ route('category', $post->category) }}" class="text-orange-400 no-underline hover:text-orange-600">
            {{ $post->category_formated }}
        </a> -->
</p>
<!--
@if( !$loop->last )
<hr class="bg-gray-200 border-gray-400 border-solid mx-20 mt-16">
@endif -->

</div>
<div class="flex flex-col flex-grow md:text-right md:content-end md:justify-end text-sm uppercase">

    <p class="block">
@if(isset($post->author['link']) && $post->author['link'] !== '' )
    <a href="{{ $post->author['link'] }}" target="_blank" rel="noopener" class="no-underline text-teal-700 font-semibold">
        {{ $post->author['name'] }}
    </a>
    @else
    {{ $post->author['name'] }}
    @endif

    </p>
<time datetime="{{ $post->published }}" class="text-gray-600 font-semibold py-1">
        {{ $post->dateShort }}
    </time>
</div>
</div>
</article>
