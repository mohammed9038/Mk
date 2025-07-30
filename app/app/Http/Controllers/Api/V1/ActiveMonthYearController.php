<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ActiveMonthYear;

class ActiveMonthYearController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ActiveMonthYear::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'year' => 'required|integer',
            'month' => 'required|integer',
            'is_open' => 'boolean',
        ]);
        return ActiveMonthYear::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return ActiveMonthYear::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $period = ActiveMonthYear::findOrFail($id);
        $data = $request->validate([
            'year' => 'sometimes|integer',
            'month' => 'sometimes|integer',
            'is_open' => 'boolean',
        ]);
        $period->update($data);
        return $period;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $period = ActiveMonthYear::findOrFail($id);
        $period->delete();
        return response()->noContent();
    }
}
