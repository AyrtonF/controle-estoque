
'use client';

import { ReactNode } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column as PrimeColumn } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';

interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface TableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  isLoading?: boolean;
  onExport?: () => void;
}

export function Table<T extends Record<string, any>>({ 
  data, 
  columns, 
  keyExtractor, 
  emptyMessage = 'Nenhum dado encontrado', 
  isLoading
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full h-32 flex items-center justify-center bg-white rounded-lg shadow-sm">
        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <DataTable 
        value={data as any[]} 
        emptyMessage={emptyMessage}
        responsiveLayout="scroll"
        stripedRows
        className="text-sm"
        paginator={data.length > 5}
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        dataKey={(item) => keyExtractor(item as T)}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} a {last} de {totalRecords}"
      >
        {columns.map((col, index) => (
          <PrimeColumn
            key={index}
            header={col.header}
            field={col.accessor as string}
            body={col.render ? (rowData) => col.render!(rowData as T) : undefined}
            headerClassName="bg-gray-50 text-gray-700 font-medium text-xs uppercase px-6 py-3"
            bodyClassName={`px-6 py-4 text-nautico-black ${col.className || ''}`}
          />
        ))}
      </DataTable>
    </div>
  );
}
