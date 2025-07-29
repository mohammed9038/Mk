<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\Category;

class Supplier extends Model
{
    protected $fillable = [
        'supplier_code',
        'name',
        'classification',
    ];

    public function categories()
    {
        return $this->hasMany(Category::class);
    }
}
