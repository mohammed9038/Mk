<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\Channel;

class Region extends Model
{
    protected $fillable = [
        'region_code',
        'name',
        'is_active',
    ];

    public function channels()
    {
        return $this->hasMany(Channel::class);
    }
}
