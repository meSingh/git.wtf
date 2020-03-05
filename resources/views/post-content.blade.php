

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

    <div class="border-t">
        <div class="max-w-screen-lg mx-auto pt-8 px-4 md:px-12">
            @if($post->type != 'page')
            <div class="content pt-1 pb-6 mb-6 border-0 border-b border-gray-300 border-solid text-lg">
            @else
            <div class="content pt-1 text-lg">
            @endif

                {!! $post->contents !!}

                @if($post->other_uses)
                    <div class="border-t border-gray-300 mt-10 pt-2">
                        <h4 class="text-2xl text-gray-900 font-semibold">Other uses of this solution</h4>
                        <ul>
                            @foreach($post->other_uses as $otherUse)
                                <li class="flex items-center mb-1">
                                    <svg class="w-1/12 sm:w-6 mr-1 md:mr-0" viewBox="0 0 24 24" fill="none">
                                        <path
                                            class="text-teal-400"
                                            fill="currentColor"
                                            d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z"
                                        />
                                        <path
                                            class="text-white"
                                            d="M8 13l3 3 5-7"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                    <span class="ml-2 flex-1">{{ $otherUse }}</span>
                                </li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                @if($post->further_reading || (isset($post->source) && $post->source))
                    <div class="border-t border-gray-300 mt-10 pt-2">
                        <h4 class="text-2xl text-gray-900 font-semibold">Further reading</h4>
                        <ul>
                            @if(isset($post->source) && $post->source)
                                <li class="mb-1">
                                    <a href="{{ $post->source }}" target="_blank" class="flex  items-center text-gray-900 font-normal group" rel="noopener noreferrer">
                                        <svg class="h-12 md:h-6 w-12 md:w-6 mr-1 md:mr-0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" xml:space="preserve" version="1.1" style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision;image-rendering:optimizeQuality;" viewBox="0 0 10 10" x="0px" y="0px" fill-rule="evenodd" clip-rule="evenodd">
                                            <g><path class="text-pink-400 fill-current" d="M5.006 0c2.765,0 5.007,2.241 5.007,5.006 0,2.765 -2.242,5.007 -5.007,5.007 -2.765,0 -5.006,-2.242 -5.006,-5.007 0,-2.765 2.241,-5.006 5.006,-5.006zm1.685 4.571c-0.115,0.115 -0.115,0.301 0,0.416 0.115,0.115 0.302,0.115 0.417,0l0.208 -0.208c0.572,-0.572 0.572,-1.51 0,-2.082 -0.572,-0.573 -1.51,-0.573 -2.082,0l-0.932 0.931c-0.572,0.572 -0.572,1.51 0.001,2.082 0.115,0.115 0.301,0.115 0.416,0 0.115,-0.115 0.115,-0.301 0,-0.416 -0.344,-0.344 -0.344,-0.906 0,-1.25l0.931 -0.931c0.344,-0.344 0.906,-0.344 1.25,0 0.344,0.344 0.344,0.905 0,1.249l-0.209 0.209zm-3.37 0.871c0.115,-0.115 0.115,-0.302 0,-0.417 -0.115,-0.115 -0.301,-0.115 -0.416,0l-0.208 0.209c-0.572,0.572 -0.572,1.51 0,2.082 0.572,0.573 1.509,0.573 2.082,0l0.931 -0.931c0.573,-0.573 0.573,-1.51 0,-2.083 -0.115,-0.115 -0.301,-0.115 -0.416,0 -0.115,0.115 -0.115,0.302 0,0.417 0.343,0.344 0.344,0.906 0,1.249l-0.932 0.932c-0.343,0.343 -0.905,0.343 -1.249,0 -0.344,-0.344 -0.344,-0.905 0,-1.25l0.208 -0.208z"/></g>
                                        </svg>
                                        <span class="ml-2 border-b border-transparent group-hover:border-pink-400">{{ $post->title }}</span>
                                        <span class="flex rounded-full bg-gray-500 text-white px-2 py-1 text-xs font-bold ml-2 leading-none">source</span>
                                    </a>
                                </li>
                            @endif

                            @if($post->further_reading)
                                @foreach($post->further_reading as $furtherReading)
                                    <li class="mb-1">
                                        <a href="{{ $furtherReading['link'] }}" target="_blank" class="flex items-center text-gray-900 font-normal group" rel="noopener noreferrer">
                                            <svg class="h-12 md:h-6 w-12 md:w-6 mr-1 md:mr-0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" xml:space="preserve" version="1.1" style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision;image-rendering:optimizeQuality;" viewBox="0 0 10 10" x="0px" y="0px" fill-rule="evenodd" clip-rule="evenodd">
                                                <g><path class="text-pink-400 fill-current" d="M5.006 0c2.765,0 5.007,2.241 5.007,5.006 0,2.765 -2.242,5.007 -5.007,5.007 -2.765,0 -5.006,-2.242 -5.006,-5.007 0,-2.765 2.241,-5.006 5.006,-5.006zm1.685 4.571c-0.115,0.115 -0.115,0.301 0,0.416 0.115,0.115 0.302,0.115 0.417,0l0.208 -0.208c0.572,-0.572 0.572,-1.51 0,-2.082 -0.572,-0.573 -1.51,-0.573 -2.082,0l-0.932 0.931c-0.572,0.572 -0.572,1.51 0.001,2.082 0.115,0.115 0.301,0.115 0.416,0 0.115,-0.115 0.115,-0.301 0,-0.416 -0.344,-0.344 -0.344,-0.906 0,-1.25l0.931 -0.931c0.344,-0.344 0.906,-0.344 1.25,0 0.344,0.344 0.344,0.905 0,1.249l-0.209 0.209zm-3.37 0.871c0.115,-0.115 0.115,-0.302 0,-0.417 -0.115,-0.115 -0.301,-0.115 -0.416,0l-0.208 0.209c-0.572,0.572 -0.572,1.51 0,2.082 0.572,0.573 1.509,0.573 2.082,0l0.931 -0.931c0.573,-0.573 0.573,-1.51 0,-2.083 -0.115,-0.115 -0.301,-0.115 -0.416,0 -0.115,0.115 -0.115,0.302 0,0.417 0.343,0.344 0.344,0.906 0,1.249l-0.932 0.932c-0.343,0.343 -0.905,0.343 -1.249,0 -0.344,-0.344 -0.344,-0.905 0,-1.25l0.208 -0.208z"/></g>
                                            </svg>
                                            <span class="ml-2 border-b border-transparent group-hover:border-pink-400">{{ $furtherReading['title'] }}</span>
                                            @if(isset($furtherReading['source']) && $furtherReading['source'] == true)
                                                <span class="flex rounded-full bg-gray-500 text-white px-2 py-1 text-xs font-bold ml-2 leading-none">source</span>
                                            @endif
                                        </a>
                                    </li>
                                @endforeach
                            @endif
                        </ul>
                    </div>
                @endif
            </div>
        </div>

        @if($post->type != 'page')
            <footer class="max-w-screen-lg mx-auto px-4 md:px-12 flex flex-col md:flex-row md:justify-between">
                <div class="tags mb-8 md:mb-2">
                    @foreach($post->tags as $tag)
                        <a href="{{ route('tag', $tag) }}" class="inline-block text-gray-500 uppercase rounded no-underline hover:bg-gray-800 hover:text-gray-200 text-xs uppercase font-bold tracking-wider bg-gray-200 inline-block px-2 py-1 rounded ">{{ $tag }}</a>
                    @endforeach
                </div>

                {{--@if($post->source)
                    <div class="flex justify-center">
                        <a href="{{ $post->source }}" target="_blank" rel="noopener" class="text-red-400 no-underline text-sm w-8" title="Content Source">{{ svg('source') }}</a>
                    </div>
                @endif--}}

                <a href="https://twitter.com/intent/tweet?text={{ urlencode($post->title) }}&url={{ route('post', $post->slug) }}&&via={{config('me.social.twitter')}}" target="_blank" rel="noopener" class="text-base text-blue-400 hover:text-blue-600 no-underline tweetme">{{ svg('twitter2') }} Liked the post? Consider tweeting about it?</a>
            </footer>
        @endif
    </div>
