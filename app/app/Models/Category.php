<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\Supplier;

class Category extends Model
{
    protected $fillable = [
        'category_code',
        'name',
        'supplier_id',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
