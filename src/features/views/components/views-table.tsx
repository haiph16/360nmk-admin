import { useEffect, useMemo, useState } from 'react'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import type { View } from '../data/schema'
import { useDeleteView } from '../hooks/use-views'
import { useViewsColumns } from './views-columns'

type ViewsTableProps = {
  data: View[]
  search: Record<string, unknown>
  navigate: NavigateFn
  paginationMeta?: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

export function ViewsTable({
  data,
  search,
  navigate,
  paginationMeta,
}: ViewsTableProps) {
  const { t } = useTranslation()
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const deleteView = useDeleteView()

  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [],
  })

  const columns = useMemo(() => useViewsColumns(t), [t])
  const totalPages = paginationMeta?.total_pages ?? 1

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    pageCount: totalPages,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // Bỏ getPaginationRowModel — server đã slice data rồi
    getSortedRowModel: getSortedRowModel(),
  })

  const selectedRows = table.getSelectedRowModel().rows
  const hasSelectedRows = selectedRows.length > 0

  const handleDeleteSelected = async () => {
    if (!hasSelectedRows) return

    try {
      await Promise.all(
        selectedRows.map((row) => deleteView.mutateAsync(row.original.id))
      )
      toast.success(
        `${selectedRows.length} ${t('deleted_successfully') || 'deleted'}`
      )
      setRowSelection({})
    } catch (err) {
      toast.error(t('delete_error') || 'Error deleting items')
    }
  }

  useEffect(() => {
    ensurePageInRange(totalPages)
  }, [totalPages, ensurePageInRange])

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <DataTableToolbar table={table} searchKey='name' />
        {hasSelectedRows && (
          <Button
            variant='destructive'
            onClick={handleDeleteSelected}
            disabled={deleteView.isPending}
            size='sm'
          >
            {deleteView.isPending
              ? `${t('deleting') || 'Deleting'}...`
              : `${t('delete_selected') || 'Delete'} (${selectedRows.length})`}
          </Button>
        )}
      </div>
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
                  {t('no_results')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} totalPages={totalPages} />
    </div>
  )
}
