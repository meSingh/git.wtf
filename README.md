# Git.WTF !?!

Git is fucking hard, no matter how good you get, there always comes a time when you get stuck & can't figure out a solution!

It's easy to get started, but remembering everything that it has to offer is just not practical. On top of that, git documentation is shit; you can't find anything there. If you think you can, you wouldn't be here looking for answers! 

Let's be real, the best place to find any solution for our git problems is StackOverflow, and honestly, it does have most of the answers, but we sure can do better, and that is what Git.WTF is trying to do with a curated list of several of these problems, frustrations, and tricks that can give you a solution in seconds.

[Visit Website =>>](https://git.wtf)


## Installation

To install switch to the project directory and load the Composer dependencies.

``` bash
composer install
```

Next you need to install dependencies using yarn/npm.

``` bash
yarn install
```

And finally we need to run Laravel Mix in order to compile the assets.

``` bash
yarn run dev
```

Now you should be able to visit the site and to see my blog. Of course you need to have a local environment setup already.

## Good to know

The blog articles get cached with the first request. So in order to see a change, you need to delete the cache:

``` bash
php artisan cache:clear
```
