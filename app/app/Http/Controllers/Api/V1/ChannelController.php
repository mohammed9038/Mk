<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Channel;

class ChannelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Channel::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'channel_code' => 'required|unique:channels,channel_code',
            'name' => 'required',
            'region_id' => 'required|exists:regions,id',
            'is_active' => 'boolean',
        ]);
        return Channel::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Channel::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $channel = Channel::findOrFail($id);
        $data = $request->validate([
            'channel_code' => 'sometimes|required|unique:channels,channel_code,'.$channel->id,
            'name' => 'sometimes|required',
            'region_id' => 'sometimes|exists:regions,id',
            'is_active' => 'boolean',
        ]);
        $channel->update($data);
        return $channel;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $channel = Channel::findOrFail($id);
        $channel->delete();
        return response()->noContent();
    }
}
