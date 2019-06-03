
<footer class="flex flex-row max-w-5xl footer px-6 md:px-0">
    <div class="copyright">
        &copy; 2018 <a href="{{ config('me.website') }}">{{ config('me.owner.name') }}</a>. All rights reserved.
    </div>
    <div class="links mt-8 md:mt-0">
        <a href="https://github.com/{{ config('me.social.github') }}" target="_blank" rel="noopener" data-turbolinks="false">{{ svg('github') }}</a>
        <a href="https://twitter.com/{{ config('me.social.twitter') }}" target="_blank" rel="noopener" data-turbolinks="false">{{ svg('twitter') }}</a>
        <!-- <a href="{{ url('feed') }}" target="_blank" data-turbolinks="false">{{ svg('rss') }}</a> -->
    </div>
</footer>
