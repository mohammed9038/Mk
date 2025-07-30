<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SalesTarget;

class SalesTargetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', SalesTarget::class);
        return SalesTarget::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', SalesTarget::class);
        $data = $request->validate([
            'year' => 'required|integer',
            'month' => 'required|integer',
            'region_id' => 'required|exists:regions,id',
            'channel_id' => 'required|exists:channels,id',
            'salesman_id' => 'required|exists:salesmen,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'category_id' => 'required|exists:categories,id',
            'amount' => 'required|numeric',
            'notes' => 'nullable',
        ]);
        return SalesTarget::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $target = SalesTarget::findOrFail($id);
        $this->authorize('view', $target);
        return $target;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $target = SalesTarget::findOrFail($id);
        $this->authorize('update', $target);
        $data = $request->validate([
            'year' => 'sometimes|integer',
            'month' => 'sometimes|integer',
            'region_id' => 'sometimes|exists:regions,id',
            'channel_id' => 'sometimes|exists:channels,id',
            'salesman_id' => 'sometimes|exists:salesmen,id',
            'supplier_id' => 'sometimes|exists:suppliers,id',
            'category_id' => 'sometimes|exists:categories,id',
            'amount' => 'sometimes|numeric',
            'notes' => 'nullable',
        ]);
        $target->update($data);
        return $target;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $target = SalesTarget::findOrFail($id);
        $this->authorize('delete', $target);
        $target->delete();
        return response()->noContent();
    }
}
