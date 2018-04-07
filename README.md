# GIT.WTF!?!

<img src="https://raw.githubusercontent.com/meSingh/git.wtf/master/public/images/ohshit.png" align="right" width="130px"/>


Git is hard: screwing up is easy, and figuring out how to fix your mistakes is fucking impossible.

So here are some common bad situations and how you can get out of them _in plain english_*.

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
