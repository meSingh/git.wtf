<?php

namespace App\Console\Commands;

use App\Content\Posts;
use Illuminate\Console\Command;

class AlgoliaIndexCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'algolia:index';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send posts data to algolia servers for indexing';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle(Posts $posts)
    {
        $client = \Algolia\AlgoliaSearch\SearchClient::create(
            config('services.algolia.id'),
            config('services.algolia.secret')
        );

        $index = $client->initIndex('posts');



        $res = $index->saveObjects(
            $posts->all(),
            [
                'autoGenerateObjectIDIfNotExist' => true
            ]
        );
    }
}
