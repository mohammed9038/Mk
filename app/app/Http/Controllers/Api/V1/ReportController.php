<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SalesTarget;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\SalesTargetsExport;

class ReportController extends Controller
{
    public function summary(Request $request)
    {
        $this->authorize('viewAny', SalesTarget::class);

        $query = SalesTarget::query();
        if ($request->filled('year')) { $query->where('year', $request->year); }
        if ($request->filled('month')) { $query->where('month', $request->month); }
        if ($request->filled('region_id')) { $query->where('region_id', $request->region_id); }
        if ($request->filled('channel_id')) { $query->where('channel_id', $request->channel_id); }
        if ($request->filled('supplier_id')) { $query->where('supplier_id', $request->supplier_id); }
        if ($request->filled('category_id')) { $query->where('category_id', $request->category_id); }
        if ($request->filled('employee_code')) {
            $query->whereHas('salesman', function($q) use ($request) {
                $q->where('employee_code', $request->employee_code);
            });
        }

        $user = $request->user();
        if ($user->role === 'manager') {
            $query->where('region_id', $user->region_id)
                  ->where('channel_id', $user->channel_id);
        }

        $group = $request->get('group_by', 'supplier');
        $allowed = ['supplier','category','salesman','region','channel'];
        if (!in_array($group, $allowed)) {
            return response()->json(['message' => 'Invalid group'], 422);
        }

        $map = [
            'supplier' => 'supplier_id',
            'category' => 'category_id',
            'salesman' => 'salesman_id',
            'region' => 'region_id',
            'channel' => 'channel_id',
        ];

        $data = $query->selectRaw($map[$group].' as group_id, SUM(amount) as total')
            ->groupBy($map[$group])
            ->get();

        return $data;
    }

    public function export(Request $request)
    {
        $this->authorize('viewAny', SalesTarget::class);

        $query = SalesTarget::query();
        if ($request->filled('year')) { $query->where('year', $request->year); }
        if ($request->filled('month')) { $query->where('month', $request->month); }
        if ($request->filled('region_id')) { $query->where('region_id', $request->region_id); }
        if ($request->filled('channel_id')) { $query->where('channel_id', $request->channel_id); }
        if ($request->filled('supplier_id')) { $query->where('supplier_id', $request->supplier_id); }
        if ($request->filled('category_id')) { $query->where('category_id', $request->category_id); }
        if ($request->filled('employee_code')) {
            $query->whereHas('salesman', function($q) use ($request) {
                $q->where('employee_code', $request->employee_code);
            });
        }

        $user = $request->user();
        if ($user->role === 'manager') {
            $query->where('region_id', $user->region_id)
                  ->where('channel_id', $user->channel_id);
        }

        $data = $query->get();

        return Excel::download(new SalesTargetsExport($data), 'export.xlsx');
    }
}
