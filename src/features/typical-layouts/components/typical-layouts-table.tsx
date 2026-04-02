import { useMemo, useState } from 'react'
import {
  type SortingState,
  type VisibilityState,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { TypicalLayout } from '../data/schema'
import { getTypicalLayoutsColumns } from './typical-layouts-columns'

type TypicalLayoutsTableProps = {
  data: TypicalLayout[]
  search: Record<string, unknown>
  navigate: NavigateFn
  paginationMeta?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext?: boolean
    hasPrev?: boolean
  }
}

export function TypicalLayoutsTable({
  data,
  search,
  navigate,
  paginationMeta,
}: TypicalLayoutsTableProps) {
  const { t } = useTranslation()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const { pagination, onPaginationChange } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [],
  })

  const columns = useMemo(() => getTypicalLayoutsColumns(t), [t])
  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, columnFilters, pagination },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: paginationMeta?.totalPages ?? -1,
  })

  return (
    <div className='space-y-4'>
      <DataTableToolbar table={table} searchKey='name' />

      <div className='overflow-hidden rounded-lg border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  {t('no_results') || 'No results'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        table={table}
        totalPages={paginationMeta?.totalPages ?? 1}
        className='mt-auto'
      />
    </div>
  )
}

