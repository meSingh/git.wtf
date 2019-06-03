<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    @include('layouts.partials.head')
    @include('layouts.partials.fonts')
    @yield('meta')
</head>
<body class="font-sans">

    @yield('error')
    <div class="flex flex-wrap lg:flex-col justify-center w-screen p-8">
    <section class="w-100 mx-auto">
        <div class="w-48 h-48 relative lg:float-right mt-8">
            <img src="/images/profile.jpg" class="w-64 rounded-full shadow-md">
            <img src="/images/icon_circle.png" class="w-16 rounded-full shadow-md absolute pin-b pin-r">
        </div>






    </section>

    @yield('content')

    <hr class="mb-32">

    @if(app()->environment('production'))
        @include('layouts.partials.analytics')
    @endif
    </div>
</body>
</html>