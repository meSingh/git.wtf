<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">

<head>
    @include('layouts.partials.analytics')
    @include('layouts.partials.head')
    @include('layouts.partials.fonts')
    @yield('meta')

    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css" />
</head>
<!-- <body class="font-brand text-base tracking-normal align-middle leading-relaxed text-gray-900 m-0 relative bg-gray-200 " style="background: #364f6b"> -->

<body class="font-sans text-base tracking-wide leading-relaxed text-brand-alt m-0 relative bg-gray-400">
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ config('services.analytics.gtm_id') }}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->

    <div id="app">
        <div class="sticky top-0 z-20 bg-brand p-1"></div>
        <header class="bg-brand border-0 border-b border-solid border-gray-300">
            <div class="flex justify-between mx-auto pb-0 md:pb-3 px-4 md:px-12">
                <a href="/" class="flex justify-center items-center flex-shrink-0 pt-1 mr-2 group no-underline text-white hover:text-white">
                    <span class="font-semibold text-2xl text-red-200 group-hover:text-white mr-1">Git<span class="font-black text-white">.</span>WTF </span>
                    <span class="w-12 mr-1">@include('layouts/partials/logo')</span>
                </a>

                <div class="pt-2 mr-4 md:ml-8 flex flex-grow hidden md:block relative">
                    <div class="absolute mt-3 ml-4 text-gray-600 z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.33 13.33" class="fill-current w-4 text-solstice-blue-opacity-60">
                            <path d="M13.14 12.19l-2.46-2.45a6 6 0 1 0-.94.94l2.45 2.46a.7.7 0 0 0 .48.19.66.66 0 0 0 .47-.19.68.68 0 0 0 0-.95zM1.33 6a4.67 4.67 0 1 1 8 3.29 4.67 4.67 0 0 1-8-3.29z"></path>
                        </svg>
                    </div>
                    <my-search></my-search>
                </div>

                <div class="flex pl-6 pr-8">
                    <a href="https://github.com/{{ config('me.social.github') }}" target="_blank" rel="noopener" data-turbolinks="false" class="no-underline pl-2 sm:pl-2 sm:pr-2 pt-1 md:pt-4 text-red-300 hover:text-white mr-2 md:mr-2">
                        <span class="hidden font-medium inline-block mb-3 mr-1 align-middle">Github</span> {{ svg('github-alt') }}
                    </a>
                    <a href="https://twitter.com/{{ config('me.social.twitter') }}" target="_blank" rel="noopener" data-turbolinks="false" class="no-underline pl-2 sm:pl-2 sm:pr-2 pt-1 md:pt-4 text-red-300 hover:text-white">
                        <span class="hidden font-medium inline-block mb-3 mr-1 align-middle">Twitter</span> {{ svg('twitter-alt') }}
                    </a>
                </div>

                <div class="flex">
                    <a href="https://github.com/meSingh/git.wtf/issues/new?assignees=&labels=solution+needed&template=article-request.md&title=%5BARTICLE_REQUEST%5D+" target="_blank" rel="noopener" class="pl-2 sm:px-3 py-0 flex-none flex items-center no-underline text-white leading-tight hover:bg-white hover:text-red-600 mt-2 mb-1 font-bold border-2 border-solid hover:border-white">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px" height="13px" class="flex-none mr-3 fill-current hidden"><path fill-rule="evenodd" fill="currenColor" d="M13.499,3.000 L1.499,3.000 C0.671,3.000 -0.001,2.328 -0.001,1.500 C-0.001,0.671 0.671,-0.000 1.499,-0.000 L13.499,-0.000 C14.328,-0.000 14.999,0.671 14.999,1.500 C14.999,2.328 14.328,3.000 13.499,3.000 ZM1.499,5.000 L7.499,5.000 C8.328,5.000 9.000,5.671 9.000,6.500 C9.000,7.328 8.328,8.000 7.499,8.000 L1.499,8.000 C0.671,8.000 -0.001,7.328 -0.001,6.500 C-0.001,5.671 0.671,5.000 1.499,5.000 ZM1.499,10.000 L9.499,10.000 C10.328,10.000 11.000,10.671 11.000,11.500 C11.000,12.328 10.328,13.000 9.499,13.000 L1.499,13.000 C0.671,13.000 -0.001,12.328 -0.001,11.500 C-0.001,10.671 0.671,10.000 1.499,10.000 Z"></path></svg>
                        <span class="font-semibold">Request a solution</span>
                    </a>
                    <a href="https://github.com/meSingh/git.wtf/issues/new?assignees=&labels=solution+needed&template=article-request.md&title=%5BARTICLE_REQUEST%5D+" target="_blank" rel="noopener" class="pl-2 sm:px-3 py-0 flex-none flex items-center no-underline text-white leading-tight hover:bg-white hover:text-red-600 mt-2 mb-1 font-bold border-2 border-l-0 border-solid hover:border-white">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px" height="13px" class="flex-none mr-3 fill-current hidden"><path fill-rule="evenodd" fill="currenColor" d="M13.499,3.000 L1.499,3.000 C0.671,3.000 -0.001,2.328 -0.001,1.500 C-0.001,0.671 0.671,-0.000 1.499,-0.000 L13.499,-0.000 C14.328,-0.000 14.999,0.671 14.999,1.500 C14.999,2.328 14.328,3.000 13.499,3.000 ZM1.499,5.000 L7.499,5.000 C8.328,5.000 9.000,5.671 9.000,6.500 C9.000,7.328 8.328,8.000 7.499,8.000 L1.499,8.000 C0.671,8.000 -0.001,7.328 -0.001,6.500 C-0.001,5.671 0.671,5.000 1.499,5.000 ZM1.499,10.000 L9.499,10.000 C10.328,10.000 11.000,10.671 11.000,11.500 C11.000,12.328 10.328,13.000 9.499,13.000 L1.499,13.000 C0.671,13.000 -0.001,12.328 -0.001,11.500 C-0.001,10.671 0.671,10.000 1.499,10.000 Z"></path></svg>
                        <span class="font-semibold">Submit a solution</span>
                    </a>
                </div>
            </div>
            <div class="">
                <div class="w-full px-4 pt-2 pb-8 md:hidden relative">
                    <div class="absolute mt-3 ml-4 text-gray-600 z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.33 13.33" class="fill-current w-4 text-solstice-blue-opacity-60">
                            <path d="M13.14 12.19l-2.46-2.45a6 6 0 1 0-.94.94l2.45 2.46a.7.7 0 0 0 .48.19.66.66 0 0 0 .47-.19.68.68 0 0 0 0-.95zM1.33 6a4.67 4.67 0 1 1 8 3.29 4.67 4.67 0 0 1-8-3.29z"></path>
                        </svg>
                    </div>
                    <my-search></my-search>
                </div>
            </div>
        </header>

        <section class="bg-white">
            @yield('content')
        </section>



        @include('layouts.partials.footer')
    </div>

    @if(app()->environment('production'))
    <script type="text/javascript" src="https://cdn.howuku.com/js/howu.js" key="N6V9xer17B7rVROvGQJ53g"></script>
    <script src="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js" data-cfasync="false"></script>
    <script>
        window.cookieconsent.initialise({
            "palette": {
                "popup": {
                    "background": "#f8f8f8",
                    "text": "#333333"
                },
                "button": {
                    "background": "#e84545"
                }
            },
            "showLink": false,
            "theme": "edgeless",
            "position": "bottom-left"
        });
    </script>
    @endif

    @yield('javascript')
</body>

</html>
