<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Channel;
use App\Models\Salesman;
use App\Models\Category;

class DependencyController extends Controller
{
    public function channels(Request $request)
    {
        $request->validate(['region_id' => 'required|exists:regions,id']);
        return Channel::where('region_id', $request->region_id)->get();
    }

    public function salesmen(Request $request)
    {
        $request->validate([
            'region_id' => 'required|exists:regions,id',
            'channel_id' => 'required|exists:channels,id',
        ]);
        return Salesman::where('region_id', $request->region_id)
            ->where('channel_id', $request->channel_id)
            ->get();
    }

    public function categories(Request $request)
    {
        $request->validate(['supplier_id' => 'required|exists:suppliers,id']);
        return Category::where('supplier_id', $request->supplier_id)->get();
    }
}
