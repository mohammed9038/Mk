<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Salesman;

class SalesmanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Salesman::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'employee_code' => 'required|unique:salesmen,employee_code',
            'salesman_code' => 'nullable',
            'name' => 'required',
            'region_id' => 'required|exists:regions,id',
            'channel_id' => 'required|exists:channels,id',
            'classification' => 'required|in:food,non_food,both',
        ]);
        return Salesman::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Salesman::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $salesman = Salesman::findOrFail($id);
        $data = $request->validate([
            'employee_code' => 'sometimes|required|unique:salesmen,employee_code,'.$salesman->id,
            'salesman_code' => 'nullable',
            'name' => 'sometimes|required',
            'region_id' => 'sometimes|exists:regions,id',
            'channel_id' => 'sometimes|exists:channels,id',
            'classification' => 'sometimes|in:food,non_food,both',
        ]);
        $salesman->update($data);
        return $salesman;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $salesman = Salesman::findOrFail($id);
        $salesman->delete();
        return response()->noContent();
    }
}
