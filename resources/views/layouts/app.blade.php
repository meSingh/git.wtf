<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    @include('layouts.partials.head')
    @include('layouts.partials.fonts')
    @yield('meta')

</head>
<body class="font-sans pb-16 bg-grey-lightest text-grey-darkest min-h-screen xl:pt-8">

    <header class="header min-h-12 md:min-h-16 z-50 max-w-2xl mx-auto flex bg-white shadow-theme md:rounded-md mb-6 sm:mb-10">

        <a href="/" class="w-12 md:w-20 h-nav md:h-nav-l flex-none bg-purple text-2xl xl:rounded-l-md flex justify-center items-center">
            <img src="/images/logo.png" class="logo max-w-8 md:max-w-10">
        </a>

        <div class="w-full relative flex">
            <div class="w-full flex">
                <div class="px-2 md:px-4 flex-auto flex">
                    <a href="mailto:{{ config('me.email') }}?Subject=GITWTF: Post Submission" class="border-transparent pl-2 sm:pl-6 sm:pr-4 py-3 md:py-6 flex-none flex items-center border-b-2 hover:border-theme text-black no-underline hover:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px" height="13px" class="flex-none mr-3 fill-current"><path fill-rule="evenodd" fill="currenColor" d="M13.499,3.000 L1.499,3.000 C0.671,3.000 -0.001,2.328 -0.001,1.500 C-0.001,0.671 0.671,-0.000 1.499,-0.000 L13.499,-0.000 C14.328,-0.000 14.999,0.671 14.999,1.500 C14.999,2.328 14.328,3.000 13.499,3.000 ZM1.499,5.000 L7.499,5.000 C8.328,5.000 9.000,5.671 9.000,6.500 C9.000,7.328 8.328,8.000 7.499,8.000 L1.499,8.000 C0.671,8.000 -0.001,7.328 -0.001,6.500 C-0.001,5.671 0.671,5.000 1.499,5.000 ZM1.499,10.000 L9.499,10.000 C10.328,10.000 11.000,10.671 11.000,11.500 C11.000,12.328 10.328,13.000 9.499,13.000 L1.499,13.000 C0.671,13.000 -0.001,12.328 -0.001,11.500 C-0.001,10.671 0.671,10.000 1.499,10.000 Z"></path></svg>
                        <span class="font-semibold">Submit</span>
                    </a>
                    <span class="border-r mx-4 lg:mx-6 my-4"></span>

                    <div class="flex-auto flex items-center justify-center">
                        <form action="/" method="get" class="w-full flex">
                            <div class="flex-initial w-full">
                                <label for="search" class="hidden">Search</label>
                                <input value="{{ request()->get('query') }}" id="query" name="query" placeholder="search for git tips" class="search-input block w-full flex-auto mr-2 py-2 md:py-4 pt-4 sm:pl-4 bg-transparent text-grey">
                            </div>
                            <div class="flex-initial">
                                <button type="submit" id="submit" class="search-icon text-grey hover:text-aloha p-3 md:p-4">
                                    <svg width="20" height="20" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg" class="fill-current"><path d="M1216 832q0-185-131.5-316.5t-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5 316.5-131.5 131.5-316.5zm512 832q0 52-38 90t-90 38q-54 0-90-38l-343-342q-179 124-399 124-143 0-273.5-55.5t-225-150-150-225-55.5-273.5 55.5-273.5 150-225 225-150 273.5-55.5 273.5 55.5 225 150 150 225 55.5 273.5q0 220-124 399l343 343q37 37 37 90z"></path></svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div> <!---->

        </div>
    </header>

    @yield('content')

    <section class="bg-white shadow-theme mt-10 max-w-2xl mx-auto  xl:rounded-md md:pt-5 py-12 px-6">
        <h3 class="mb-2">Want to Contribute?</h3>

        <p class="mb-6">Send me an <a href="mailto:{{ config('me.email') }}?Subject={{ config('me.name') }}">Email</a>, ping me on <a href="https://twitter.com/{{ config('me.social.twitter') }}">Twitter</a> or submit a pull request on <a href="https://github.com/{{ config('me.social.github') }}/pulls">Github</a>.</p>

        <p class="mb-2">Sign up below to receive updates, tips and more handy tutorials when git screws up. It’s good stuff & I don’t spam.</p>

        <form action="https://khurafatstudio.us13.list-manage.com/subscribe/post?u=00058058733c668eea4891e02&amp;id=d83f6d4784" method="post" class="mt-4 flex flex-wrap">
            <input type="email" placeholder="Enter your email address..." name="EMAIL" class="bg-grey-lightest shadow-theme py-4 px-4 w-full lg:w-2/3 text-grey">
            <input type="hidden" name="LOCATION" value="GIT.WTF!?!">
            <button type="submit" class="text-purple-dark hover:text-purple-dark border-2 border-purple py-4 px-8 font-semibold rounded mt-4 lg:mt-0 xl:ml-4 inline-block no-underline w-full xl:w-auto">Sign me up!</button>
        </form>
    </section>

    @include('layouts.partials.footer')
    @include('layouts.partials.analytics')

</body>
</html>
