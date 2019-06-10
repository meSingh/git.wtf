<?php

return [
    /*
    |--------------------------------------------------------------------------
    | View Storage Paths
    |--------------------------------------------------------------------------
    |
    | Most templating systems load templates from disk. Here you may specify
    | an array of paths that should be checked for your views. Of course
    | the usual Laravel view path has already been registered for you.
    |
    */

    'name' => 'GIT.WTF!?!',
    'owner' => [
        'name' => 'Mandeep Singh'
    ],
    'website' => 'https://www.msingh.com',
    'summary' => 'Git is hard: screwing up is easy, and figuring out how to fix your mistakes is fucking impossible. So here are some common bad situations and how you can get out of them in plain english*.',

    'email' => 'im@msingh.me',

    'social' => [
        'twitter' => 'gitwtf',
        'github' => 'meSingh/git.wtf'
    ],

    'authors' => [
        'msingh' => [
            'name' => 'Mandeep Singh',
            'link' => 'https://www.msingh.com'
        ],
        'bsahil' => [
            'name' => 'Sahil Bhatacharya',
            'link' => 'https://bsahil.com'
        ]
    ],

    // 'categories' => [
    //     'solving-mistories' => 'Solving Mistories',
    //     'mistakes-correction' => 'Mistakes Correction',
    //     'acidents-recovery' => 'Acidents Recovery',
    //     'fuck' => 'Fuck'
    // ],

    'seo' => [
        'title' => 'GIT.WTF!?! - Figure out ways to fix GIT screw-ups',
        'description' => 'Git is hard: screwing up is easy, and figuring out how to fix your mistakes is fucking impossible. So here are some common bad situations and how you can get out of them in plain english*.'
    ],

    'rss' => [
        'title' => 'GIT.WTF!?! - Figure out ways to fix GIT screw-ups',
        'description' => 'Git is hard: screwing up is easy, and figuring out how to fix your mistakes is fucking impossible. So here are some common bad situations and how you can get out of them in plain english*.'
    ],

    'extras' => [
        'robots' => env('ALLOW_ROBOTS', true),
    ],
];
