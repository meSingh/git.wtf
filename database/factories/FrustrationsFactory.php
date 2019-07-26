<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use App\Frustrations;
use Faker\Generator as Faker;

$factory->define(Frustrations::class, function (Faker $faker) {

    return [
        'name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'request' => $faker->realText(),
        'anonymous' => rand(0, 1),
    ];
});
