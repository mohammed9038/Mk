<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActiveMonthYear extends Model
{
    protected $fillable = [
        'year',
        'month',
        'is_open',
    ];
}
