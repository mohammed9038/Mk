<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Region;

class RegionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Region::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'region_code' => 'required|unique:regions,region_code',
            'name' => 'required',
            'is_active' => 'boolean',
        ]);
        return Region::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Region::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $region = Region::findOrFail($id);
        $data = $request->validate([
            'region_code' => 'sometimes|required|unique:regions,region_code,'.$region->id,
            'name' => 'sometimes|required',
            'is_active' => 'boolean',
        ]);
        $region->update($data);
        return $region;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $region = Region::findOrFail($id);
        $region->delete();
        return response()->noContent();
    }
}
