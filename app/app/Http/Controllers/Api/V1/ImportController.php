<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Arr;

class ImportController extends Controller
{
    public function masterData(Request $request)
    {
        $this->authorize('create', \App\Models\Region::class); // admin only

        $request->validate([
            'file' => 'required|file|mimes:xlsx'
        ]);

        $path = $request->file('file')->getRealPath();
        $sheets = Excel::toCollection(null, $path);

        DB::transaction(function () use ($sheets) {
            $sheet = $sheets->first();
            if (!$sheet) {
                return;
            }

            if ($sheet->has('regions')) {
                foreach ($sheet['regions'] as $row) {
                    if (!Arr::get($row, 'region_code')) { continue; }
                    \App\Models\Region::updateOrCreate(
                        ['region_code' => $row['region_code']],
                        ['name' => $row['name'] ?? '', 'is_active' => Arr::get($row, 'is_active', true)]
                    );
                }
            }

            if ($sheet->has('channels')) {
                foreach ($sheet['channels'] as $row) {
                    if (!Arr::get($row, 'channel_code')) { continue; }
                    $region = \App\Models\Region::where('region_code', $row['region_code'])->first();
                    if (!$region) { continue; }
                    \App\Models\Channel::updateOrCreate(
                        ['channel_code' => $row['channel_code']],
                        [
                            'name' => $row['name'] ?? '',
                            'region_id' => $region->id,
                            'is_active' => Arr::get($row, 'is_active', true)
                        ]
                    );
                }
            }

            if ($sheet->has('suppliers')) {
                foreach ($sheet['suppliers'] as $row) {
                    if (!Arr::get($row, 'supplier_code')) { continue; }
                    \App\Models\Supplier::updateOrCreate(
                        ['supplier_code' => $row['supplier_code']],
                        ['name' => $row['name'] ?? '', 'classification' => $row['classification'] ?? null]
                    );
                }
            }

            if ($sheet->has('categories')) {
                foreach ($sheet['categories'] as $row) {
                    if (!Arr::get($row, 'category_code')) { continue; }
                    $supplier = \App\Models\Supplier::where('supplier_code', $row['supplier_code'])->first();
                    if (!$supplier) { continue; }
                    \App\Models\Category::updateOrCreate(
                        ['category_code' => $row['category_code'], 'supplier_id' => $supplier->id],
                        ['name' => $row['name'] ?? '']
                    );
                }
            }

            if ($sheet->has('salesmen')) {
                foreach ($sheet['salesmen'] as $row) {
                    if (!Arr::get($row, 'employee_code')) { continue; }
                    $region = \App\Models\Region::where('region_code', $row['region_code'])->first();
                    $channel = \App\Models\Channel::where('channel_code', $row['channel_code'])->first();
                    if (!$region || !$channel) { continue; }
                    \App\Models\Salesman::updateOrCreate(
                        ['employee_code' => $row['employee_code']],
                        [
                            'salesman_code' => Arr::get($row, 'salesman_code'),
                            'name' => $row['name'] ?? '',
                            'region_id' => $region->id,
                            'channel_id' => $channel->id,
                            'classification' => $row['classification'] ?? null
                        ]
                    );
                }
            }

            if ($sheet->has('users')) {
                foreach ($sheet['users'] as $row) {
                    if (!Arr::get($row, 'username')) { continue; }
                    $data = [
                        'name' => $row['name'] ?? '',
                        'role' => $row['role'] ?? 'manager',
                    ];
                    if ($regionCode = Arr::get($row, 'region_code')) {
                        $region = \App\Models\Region::where('region_code', $regionCode)->first();
                        $data['region_id'] = $region?->id;
                    }
                    if ($channelCode = Arr::get($row, 'channel_code')) {
                        $channel = \App\Models\Channel::where('channel_code', $channelCode)->first();
                        $data['channel_id'] = $channel?->id;
                    }
                    if (Arr::get($row, 'password')) {
                        $data['password'] = bcrypt($row['password']);
                    }

                    \App\Models\User::updateOrCreate(
                        ['username' => $row['username']],
                        $data
                    );
                }
            }
        });

        return response()->json(['message' => 'Imported']);
    }
}
