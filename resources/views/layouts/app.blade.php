<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    @include('layouts.partials.analytics')
    @include('layouts.partials.head')
    @include('layouts.partials.fonts')
    @yield('meta')

</head>
<body class="font-brand text-base tracking-normal align-middle leading-relaxed text-gray-800 m-0 relative">
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ config('services.analytics.gtm_id') }}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->


    <header class="">
        <div class="container max-w-5xl flex justify-between mx-auto pb-0 md:pb-3 pt-3 px-1 md:px-0">
            <a href="/" class="flex justify-center items-center flex-shrink-0 mr-4 no-underline">
                <span class="w-12 mr-1">@include('layouts/partials/logo')</span>
                <span class="font-semibold text-xl text-gray-800">GIT.WTF !?!</span>
            </a>

            <form action="/" method="get"  class="w-full px-6 py-4 flex hidden md:block">
                <input value="{{ request()->get('query') }}" name="query" class="transition text-base focus:outline-0 border border-transparent focus:bg-white focus:border-gray-300 placeholder-gray-900 rounded bg-gray-200 py-2 pr-4 px-6 w-full appearance-none shadow" type="text" placeholder="Search for git tips" autocomplete="off" spellcheck="false">
            </form>


            <a href="mailto:{{ config('me.email') }}?Subject=GITWTF: Post Submission" class="pl-2 sm:pl-6 sm:pr-4 py-3 md:py-6 flex-none flex items-center no-underline hover:text-black mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px" height="13px" class="flex-none mr-3 fill-current"><path fill-rule="evenodd" fill="currenColor" d="M13.499,3.000 L1.499,3.000 C0.671,3.000 -0.001,2.328 -0.001,1.500 C-0.001,0.671 0.671,-0.000 1.499,-0.000 L13.499,-0.000 C14.328,-0.000 14.999,0.671 14.999,1.500 C14.999,2.328 14.328,3.000 13.499,3.000 ZM1.499,5.000 L7.499,5.000 C8.328,5.000 9.000,5.671 9.000,6.500 C9.000,7.328 8.328,8.000 7.499,8.000 L1.499,8.000 C0.671,8.000 -0.001,7.328 -0.001,6.500 C-0.001,5.671 0.671,5.000 1.499,5.000 ZM1.499,10.000 L9.499,10.000 C10.328,10.000 11.000,10.671 11.000,11.500 C11.000,12.328 10.328,13.000 9.499,13.000 L1.499,13.000 C0.671,13.000 -0.001,12.328 -0.001,11.500 C-0.001,10.671 0.671,10.000 1.499,10.000 Z"></path></svg>
                <span class="font-semibold">Submit Article</span>
            </a>
            <a href="https://github.com/{{ config('me.social.github') }}" target="_blank" rel="noopener" data-turbolinks="false" class="pl-2 sm:pl-2 sm:pr-2 py-4 md:py-6 text-gray-700 hidden md:block">{{ svg('github') }}</a>
            <a href="https://twitter.com/{{ config('me.social.twitter') }}" target="_blank" rel="noopener" data-turbolinks="false" class="pl-2 sm:pl-2 sm:pr-2 py-4 md:py-6 text-gray-700 hidden md:block">{{ svg('twitter') }}</a>
        </div>
        <div class="">
            <form action="/" method="get"  class="w-full px-6 pt-2 pb-4 flex md:hidden">
                <input value="{{ request()->get('query') }}" name="query" class="transition text-base focus:outline-0 border border-transparent focus:bg-white focus:border-gray-300 placeholder-gray-900 rounded bg-gray-200 py-2 pr-4 px-6 w-full appearance-none shadow" type="text" placeholder="Search for git tips" autocomplete="off" spellcheck="false">
            </form>
        </div>
    </header>

    @yield('content')



    @include('layouts.partials.footer')


</body>
</html>
