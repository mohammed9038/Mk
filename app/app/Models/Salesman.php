<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\Region;
use App\Models\Channel;

class Salesman extends Model
{
    protected $fillable = [
        'employee_code',
        'salesman_code',
        'name',
        'region_id',
        'channel_id',
        'classification',
    ];

    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    public function channel()
    {
        return $this->belongsTo(Channel::class);
    }
}
