<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
// use Spatie\Sitemap\SitemapGenerator;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
use App\Content\Posts;
use Carbon\Carbon;

class SitemapGenerateCommand extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $signature = 'sitemap:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate the sitemap.';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle(Posts $posts)
    {
        // SitemapGenerator::create(config('app.url'))
        $sitemap = Sitemap::create()
            ->add(Url::create('/')
                ->setLastModificationDate(Carbon::yesterday())
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
                ->setPriority(0.9));

        $tags = $categories = [];

        foreach ($posts->all() as $post) {
            $sitemap->add(Url::create($post->url)
                ->setLastModificationDate($post->updated)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
                ->setPriority(0.8));

            $tags = array_merge($post->tags, $tags);
            $categories[] = $post->category;
        }

        foreach ($categories as $category) {
            $sitemap->add(Url::create(route('category', $category))
                ->setLastModificationDate(Carbon::yesterday())
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ->setPriority(0.6));
        }

        foreach ($tags as $tag) {
            $sitemap->add(Url::create(route('tag', $tag))
                ->setLastModificationDate(Carbon::yesterday())
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ->setPriority(0.4));
        }


        $sitemap->writeToFile(public_path('sitemap.xml'));
    }
}
