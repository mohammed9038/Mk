<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\Salesman;

class SalesTarget extends Model
{
    protected $fillable = [
        'year',
        'month',
        'region_id',
        'channel_id',
        'salesman_id',
        'supplier_id',
        'category_id',
        'amount',
        'notes',
    ];

    public function salesman()
    {
        return $this->belongsTo(Salesman::class);
    }
}
