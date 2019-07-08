<?php


Route::feeds();

Route::get('/', 'HomeController@index')->name('home');

Route::get('tag/{slug}', 'HomeController@tag')->name('tag');
Route::get('category/{slug}', 'HomeController@category')->name('category');
Route::get('{slug}', 'HomeController@show')->name('post');

Route::permanentRedirect(
    '/how-to-change-the-message-on-last-commit',
    '/how-to-change-the-message-on-last-commit-in-git'
);

Route::permanentRedirect(
    '/how-to-move-accidentally-committed-changes-to-a-brand-new-branch',
    '/how-to-move-accidentally-committed-changes-to-a-brand-new-branch-in-git'
);
