<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Sitemap\SitemapGenerator;

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
    public function handle()
    {
        // dd(config('app.url'));
        // modify this to your own needs
        // SitemapGenerator::create(config('app.url'))
        SitemapGenerator::create('https://git.wtf')
            ->writeToFile(public_path('sitemap.xml'));
    }
}