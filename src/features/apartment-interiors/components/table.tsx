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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTableToolbar } from '@/components/data-table'
import type { ApartmentInterior } from '../data/schema'
import { getApartmentInteriorsColumns } from './columns'

type ApartmentInteriorsTableProps = {
  data: ApartmentInterior[]
  paginationMeta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  onPageChange?: (page: number) => void
}

export function ApartmentInteriorsTable({
  data,
  paginationMeta,
  onPageChange,
}: ApartmentInteriorsTableProps) {
  const { t } = useTranslation()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const columns = useMemo(() => getApartmentInteriorsColumns(t), [t])
  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, columnFilters },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  {t('no_results') || 'No results'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {paginationMeta && (
        <div className='flex items-center justify-between'>
          <div className='text-sm text-muted-foreground'>
            {t('showing') || 'Showing'}{' '}
            {(paginationMeta.page - 1) * paginationMeta.limit + 1} to{' '}
            {Math.min(
              paginationMeta.page * paginationMeta.limit,
              paginationMeta.total
            )}{' '}
            of {paginationMeta.total} {t('results') || 'results'}
          </div>
          <div className='flex gap-2'>
            <button
              onClick={() => onPageChange?.(paginationMeta.page - 1)}
              disabled={paginationMeta.page === 1}
              className='rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50'
            >
              {t('previous') || 'Previous'}
            </button>
            <div className='flex items-center gap-1'>
              {Array.from(
                { length: paginationMeta.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange?.(page)}
                  className={`h-8 w-8 rounded-md border ${
                    page === paginationMeta.page
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input bg-background hover:bg-muted'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => onPageChange?.(paginationMeta.page + 1)}
              disabled={paginationMeta.page === paginationMeta.totalPages}
              className='rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50'
            >
              {t('next') || 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
