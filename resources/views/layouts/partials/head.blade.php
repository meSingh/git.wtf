<meta charset="utf-8">
<meta http-equiv="x-ua-compatible" content="ie=edge">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover">
<meta name="description" content="{{ config('me.seo.description') }}">
<meta name="author" content="{{ config('me.owner.name') }}">
@if(isset($canonical_url) && $canonical_url)
    <link rel="canonical" href="{{ $canonical_url }}">
@endif

<title>{{ isset($title) ? ($title . ' — ' . config('me.name')) : config('me.name') }}</title>

@include('feed::links')

@include('layouts.partials.favicons')


<link rel="stylesheet" type="text/css" href="{{ mix('css/app.css') }}">

<script defer src="{{ mix('js/app.js') }}"></script>

@stack('head')
