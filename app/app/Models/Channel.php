<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\Region;

class Channel extends Model
{
    protected $fillable = [
        'channel_code',
        'name',
        'is_active',
        'region_id',
    ];

    public function region()
    {
        return $this->belongsTo(Region::class);
    }
}
