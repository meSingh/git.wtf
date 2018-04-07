<?php

namespace Tests\Features;

use Tests\CreatesApplication;
use Illuminate\Foundation\Testing\TestCase;

class PagesTest extends TestCase
{
    use CreatesApplication;

    public function test_it_displays_the_home_page()
    {
        $this->get('/')->assertStatus(200);
    }

}
