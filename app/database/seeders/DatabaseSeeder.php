<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Region;
use App\Models\Channel;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $region = Region::create([
            'region_code' => 'R1',
            'name' => 'Default Region',
        ]);

        $channel = Channel::create([
            'channel_code' => 'C1',
            'name' => 'Default Channel',
            'region_id' => $region->id,
        ]);

        User::create([
            'username' => 'admin',
            'name' => 'Administrator',
            'role' => 'admin',
            'password' => bcrypt('password'),
        ]);

        User::create([
            'username' => 'manager',
            'name' => 'Manager',
            'role' => 'manager',
            'region_id' => $region->id,
            'channel_id' => $channel->id,
            'password' => bcrypt('password'),
        ]);
    }
}
