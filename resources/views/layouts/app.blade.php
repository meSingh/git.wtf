<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">

<head>
    @include('layouts.partials.analytics')
    @include('layouts.partials.head')
    @include('layouts.partials.fonts')
    @yield('meta')
</head>
<!-- <body class="font-brand text-base tracking-normal align-middle leading-relaxed text-gray-900 m-0 relative bg-gray-200 " style="background: #364f6b"> -->

<body class="font-sans text-lg leading-normal text-gray-800 m-0 relative bg-white">
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ config('services.analytics.gtm_id') }}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->

    <div id="app" style="font-family: 'Nunito Sans', sans-serif;">
        <div class="bg-brand pt-3"></div>
        <header class="max-w-screen-xl mx-auto py-3 md:py-6">
            <div class="flex flex-col md:flex-row justify-between mx-auto pb-0 px-4 md:px-12">
                <a href="/" class="flex justify-center items-center flex-shrink lg:mr-6 group no-underline text-gray-800 text-2xl hover:text-red-400 ">
                    <span class=" font-bold">git.</span><span class="font-light">wtf</span>
                </a>

                <div class="flex flex-grow justify-end">

                    <my-search></my-search>

                    <ul class="uppercase tracking-wide font-bold w-full block flex-none hidden md:flex md:w-auto items-center mt-0">
                        <li class="mr-5 lg:mr-8 mb-0"><a href="/about" class="text-gray-800 hover:text-gray-600">About</a></li>
                        <li class="mr-8 mb-0 hidden lg:block"><a href="https://github.com/meSingh/git.wtf" class="text-gray-800 hover:text-gray-600">Github</a></li>
                        <li class="mb-0"><a href="https://airtable.com/shrrRtPS4oICgRVPM" class="text-gray-800 hover:text-gray-600">Submit Article</a></li>
                    </ul>
                </div>
            </div>
        </header>

        <section class="bg-white">
            @yield('content')
        </section>



        @include('layouts.partials.footer')
    </div>

    <script>
        var ALGOLIA_INSIGHTS_SRC = "https://cdn.jsdelivr.net/npm/search-insights@1.1.1";

        !function(e,a,t,n,s,i,c){e.AlgoliaAnalyticsObject=s,e.aa=e.aa||function(){
        (e.aa.queue=e.aa.queue||[]).push(arguments)},i=a.createElement(t),c=a.getElementsByTagName(t)[0],
        i.async=1,i.src=ALGOLIA_INSIGHTS_SRC,c.parentNode.insertBefore(i,c)
        }(window,document,"script",0,"aa");

        aa('init', {
            appId: '{{ env("MIX_ALGOLIA_APP_ID")}}',
            apiKey: '{{ env("MIX_ALGOLIA_SEARCH")}}',
        });
    </script>

    @yield('javascript')
</body>

</html>
