<?php


Route::feeds();

Route::get('/', 'HomeController@index')->name('home');

Route::get('{slug}', 'HomeController@show')->name('post');
