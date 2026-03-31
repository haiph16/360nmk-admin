import { useMemo, useState } from 'react'
import {
  type SortingState,
  type VisibilityState,
  type ExpandedState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTableToolbar, DataTablePagination } from '@/components/data-table'
import type { Product } from '../data/schema'
import { useProductsColumns } from './products-columns'

type ProductWithChildren = Product & { subRows?: ProductWithChildren[] }

/** Flatten nested API response (which may already have children[]) into a flat list */
function flattenTree(items: any[]): Product[] {
  const result: Product[] = []
  for (const item of items) {
    const { children, ...rest } = item
    result.push(rest as Product)
    if (children?.length) {
      result.push(...flattenTree(children))
    }
  }
  return result
}

/** Rebuild tree from flat list using parent_id */
function buildTree(flatData: Product[]): ProductWithChildren[] {
  const map = new Map<number, ProductWithChildren>()
  const roots: ProductWithChildren[] = []

  for (const item of flatData) {
    map.set(item.id, { ...item })
  }

  for (const item of map.values()) {
    if (item.parent_id == null) {
      roots.push(item)
    } else {
      const parent = map.get(item.parent_id)
      if (parent) {
        parent.subRows = parent.subRows ?? []
        parent.subRows.push(item)
      }
    }
  }

  return roots
}

type ProductsTableProps = {
  data: Product[]
  search: Record<string, unknown>
  navigate: NavigateFn
  paginationMeta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function ProductsTable({
  data,
  search,
  navigate,
  paginationMeta,
}: ProductsTableProps) {
  const { t } = useTranslation()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [expanded, setExpanded] = useState<ExpandedState>(true)

  const treeData = useMemo(() => buildTree(flattenTree(data as any[])), [data])

  const { columnFilters, onColumnFiltersChange } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [{ columnId: 'name', searchKey: 'name', type: 'string' }],
  })

  const columns = useMemo(() => useProductsColumns(t), [t])

  const table = useReactTable({
    data: treeData,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      expanded,
    },
    getSubRows: (row) => (row as ProductWithChildren).subRows,
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    filterFromLeafRows: true,
  })
  const totalPages = paginationMeta?.totalPages ?? 1
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
                <TableRow
                  key={row.id}
                  className={cn(
                    row.depth === 0 && 'bg-muted/30 font-medium',
                    row.depth > 0 && 'hover:bg-muted/50'
                  )}
                >
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

      <DataTablePagination
        table={table}
        totalPages={totalPages}
        className='mt-auto'
      />
    </div>
  )
}
