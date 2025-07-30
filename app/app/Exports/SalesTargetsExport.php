<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class SalesTargetsExport implements FromCollection, WithHeadings
{
    protected Collection $data;

    public function __construct(Collection $data)
    {
        $this->data = $data;
    }

    public function collection(): Collection
    {
        return $this->data->map(function ($t) {
            return [
                'year' => $t->year,
                'month' => $t->month,
                'region_id' => $t->region_id,
                'channel_id' => $t->channel_id,
                'salesman_id' => $t->salesman_id,
                'supplier_id' => $t->supplier_id,
                'category_id' => $t->category_id,
                'amount' => $t->amount,
                'notes' => $t->notes,
            ];
        });
    }

    public function headings(): array
    {
        return ['year','month','region_id','channel_id','salesman_id','supplier_id','category_id','amount','notes'];
    }
}
