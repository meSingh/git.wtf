@php
    $showHomeLink = $showHomeLink ?? request()->path() !== '/';

    $title = $title ?? array_random([
        '¯\_(ツ)_/¯', 'Awkward.', 'Bantha fodder.', 'Hmmm...', 'Oh no!',
        'Peculiar.', 'Uh oh.', 'Whoops!',
    ]);
@endphp

@extends('layouts.home')

@section('error')
    <section class="error py-30 w-100 mx-auto mt-8 text-center">
        <h1 class="error__title">
            {{ $title }}
        </h1>
        <p class="error__message">
            {{ $message }}
        </p>
        @if($showHomeLink)
            <a href="{{ url('/') }}" class="button">
                Go home
            </a>
        @endunless
    </section>
@endsection
