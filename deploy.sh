#!/bin/sh

# This script is supposed to be run after pulling all
# the changes from git remote.

cd /home/msingh/git.wtf
pwd

# eval "$(ssh-agent -s)"
# echo "$(SSH_PASS)" | ssh-add ~/.ssh/id_rsa

# Pull latest code from github
git pull origin master

# Let's tie any loose end's if there are any..
composer install -q --no-ansi --no-interaction --no-suggest --no-progress --prefer-dist --optimize-autoloader --no-dev

# If everything worked out correctly then clear any previous caches and rebuild new ones
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan responsecache:clear
php artisan algolia:index

# Finally, compile any assets that might have been updated
yarn install
yarn run production

php artisan sitemap:generate
