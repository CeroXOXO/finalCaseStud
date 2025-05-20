<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'role' => User::ADMIN,
        ]);

        User::create([
            'name' => 'Joshua Bolilan',
            'email' => 'joshuabolilan@gmail.com',
            'password' => Hash::make('password'),
            'role' => User::PROJECT_MANAGER,
        ]);

        User::create([
            'name' => 'Adiel Brosoto',
            'email' => 'adielbrosoto@gmail.com',
            'password' => Hash::make('password'),
            'role' => User::TEAM_MEMBER,
        ]);

        User::create([
            'name' => 'Donna Cabuyao',
            'email' => 'donnacabuyao@gmail.com',
            'password' => Hash::make('password'),
            'role' => User::TEAM_MEMBER,
        ]);

        User::create([
            'name' => 'Clarisse Cartagena',
            'email' => 'clarissecartagena@gmail.com',
            'password' => Hash::make('password'),
            'role' => User::CLIENT,
        ]);
        
        User::create([
            'name' => 'John Cero',
            'email' => 'johncero@gmail.com',
            'password' => Hash::make('password'),
            'role' => User::CLIENT,
        ]);
    }
}
