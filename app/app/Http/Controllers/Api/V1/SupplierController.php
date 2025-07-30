<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Supplier;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Supplier::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'supplier_code' => 'required|unique:suppliers,supplier_code',
            'name' => 'required',
            'classification' => 'required|in:food,non_food',
        ]);
        return Supplier::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Supplier::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $supplier = Supplier::findOrFail($id);
        $data = $request->validate([
            'supplier_code' => 'sometimes|required|unique:suppliers,supplier_code,'.$supplier->id,
            'name' => 'sometimes|required',
            'classification' => 'sometimes|in:food,non_food',
        ]);
        $supplier->update($data);
        return $supplier;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();
        return response()->noContent();
    }
}
