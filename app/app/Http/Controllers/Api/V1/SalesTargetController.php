<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SalesTarget;
use App\Models\ActiveMonthYear;
use App\Models\Salesman;

class SalesTargetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', SalesTarget::class);

        $query = SalesTarget::query();

        if ($request->filled('year')) {
            $query->where('year', $request->year);
        }
        if ($request->filled('month')) {
            $query->where('month', $request->month);
        }
        if ($request->filled('region_id')) {
            $query->where('region_id', $request->region_id);
        }
        if ($request->filled('channel_id')) {
            $query->where('channel_id', $request->channel_id);
        }
        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('employee_code')) {
            $query->whereHas('salesman', function ($q) use ($request) {
                $q->where('employee_code', $request->employee_code);
            });
        }

        $user = $request->user();
        if ($user->role === 'manager') {
            $query->where('region_id', $user->region_id)
                  ->where('channel_id', $user->channel_id);
        }

        return $query->get();
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

        $user = $request->user();
        if ($user->role === 'manager' && ($user->region_id != $data['region_id'] || $user->channel_id != $data['channel_id'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $periodOpen = ActiveMonthYear::where('year', $data['year'])
            ->where('month', $data['month'])
            ->where('is_open', true)
            ->exists();

        if (!$periodOpen) {
            return response()->json(['message' => 'Period is closed'], 422);
        }

        $exists = SalesTarget::where('year', $data['year'])
            ->where('month', $data['month'])
            ->where('salesman_id', $data['salesman_id'])
            ->where('supplier_id', $data['supplier_id'])
            ->where('category_id', $data['category_id'])
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Target already exists'], 422);
        }

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

        $user = $request->user();
        if ($user->role === 'manager' && (($request->has('region_id') && $user->region_id != $request->region_id) || ($request->has('channel_id') && $user->channel_id != $request->channel_id))) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (($request->has('year') || $request->has('month')) && !ActiveMonthYear::where('year', $request->get('year', $target->year))
            ->where('month', $request->get('month', $target->month))
            ->where('is_open', true)->exists()) {
            return response()->json(['message' => 'Period is closed'], 422);
        }

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
