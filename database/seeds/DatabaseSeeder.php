<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
         factory(App\Frustrations::class, 50)->create();
        // $this->call(UsersTableSeeder::class);
    }
}
