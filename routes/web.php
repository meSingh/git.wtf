<?php


Route::feeds();

Route::get('/', 'HomeController@index')->name('home');

Route::get('tag/{slug}', 'HomeController@tag')->name('tag');
Route::get('category/{slug}', 'HomeController@category')->name('category');
Route::get('git-frustrations', 'HomeController@frustrations')->name('frustrations');

Route::permanentRedirect(
    '/how-to-change-the-message-on-last-commit',
    '/how-to-change-the-message-on-last-commit-in-git'
);

Route::permanentRedirect(
    '/how-to-move-accidentally-committed-changes-to-a-brand-new-branch',
    '/how-to-move-accidentally-committed-changes-to-a-brand-new-branch-in-git'
);

Route::permanentRedirect(
    '/how-to-sync-my-commits-with-multiple-repositories',
    '/how-to-sync-my-commits-with-multiple-repositories-in-git'
);

Route::permanentRedirect(
    '/how-to-squash-last-x-commits-together',
    '/how-to-squash-last-x-commits-together-in-git'
);

Route::permanentRedirect(
    '/how-to-revert-last-x-commits',
    '/how-to-revert-last-x-commits-in-git'
);

Route::get('{slug}', 'HomeController@show')->name('post');
