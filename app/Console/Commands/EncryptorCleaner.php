<?php

namespace App\Console\Commands;

use App\Encryptor;
use Illuminate\Console\Command;

class EncryptorCleaner extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'encryptor:clean';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove expired encryptor database records';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $items = Encryptor::where('expires', '<=', new \DateTime())
            ->get();

        foreach ($items as $item) {
            $item->delete();
        }

        $this->info("Found and removed {$items->count()} records");
    }
}
