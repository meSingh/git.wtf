@extends('layouts.app')

@section('meta')
<meta property="og:url" content="{{ url()->current() }}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="{{-- $post->title --}}" />
<meta property="og:description" content="{{-- $post->summary_short --}}" />
<meta property="og:image" content="{{-- $post->preview_image --}}" />

<meta name="twitter:card" content="summary" />
<meta name="twitter:site" content="{{ '@'. config('me.social.twitter') }}" />
<meta name="twitter:title" content="{{-- $post->title --}}" />
<meta name="twitter:description" content="{{-- $post->summary_short --}}" />
<meta name="twitter:image" content="{{-- $post->preview_image --}}" />
@endsection

@section('content')

<frustrations :frustrations="{{ $frustrations }}"></frustrations>

@endsection

@section('javascript')


@endsection
