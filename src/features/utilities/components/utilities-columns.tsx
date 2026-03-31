import { ColumnDef, Row } from '@tanstack/react-table'
import { ChevronDown, ChevronRight, Folder, FileImage } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/data-table'
import type { Utility } from '../data/schema'
import { UtilitiesTableRowActions } from './utilities-table-row-actions'

function ExpandToggle({ row }: { row: Row<Utility> }) {
  if (!row.getCanExpand()) return null
  return (
    <Button
      variant='ghost'
      size='icon'
      className='h-5 w-5 p-0'
      onClick={(e) => {
        e.stopPropagation()
        row.toggleExpanded()
      }}
    >
      {row.getIsExpanded() ? (
        <ChevronDown className='h-4 w-4' />
      ) : (
        <ChevronRight className='h-4 w-4' />
      )}
    </Button>
  )
}

export function useUtilitiesColumns(
  t: ReturnType<typeof useTranslation>['t']
): ColumnDef<Utility>[] {
  return [
    {
      id: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('name')} />
      ),
      accessorKey: 'name',
      enableSorting: true,
      cell: ({ row }) => {
        const depth = row.depth
        const hasChildren = row.getCanExpand()
        return (
          <div
            className='flex items-center gap-1'
            style={{ paddingLeft: `${depth * 20}px` }}
          >
            <ExpandToggle row={row} />
            {hasChildren ? (
              <Folder className='h-4 w-4 shrink-0 text-amber-500' />
            ) : (
              <FileImage className='h-4 w-4 shrink-0 text-muted-foreground' />
            )}
            <span className={cn('ml-1', depth === 0 && 'font-semibold')}>
              {row.getValue('name')}
            </span>
          </div>
        )
      },
    },
    {
      id: 'media_items',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('media') || 'Media Items'}
        />
      ),
      cell: ({ row }) => {
        const mediaItems = (row.original.media_items || []).sort(
          (a, b) => (a.position ?? 0) - (b.position ?? 0)
        )
        if (mediaItems.length === 0) {
          return <span className='text-muted-foreground'>-</span>
        }
        return (
          <div className='flex flex-wrap gap-2'>
            {mediaItems.map((item, index) => {
              const thumbnailUrl =
                item.media?.urls?.thumbnail ||
                item.media?.urls?.medium ||
                item.media?.urls?.original
              const position = item.position ?? index
              return (
                <div
                  key={index}
                  className='group relative h-10 w-10'
                  title={`Position: ${position}, Media ID: ${item.media_id}`}
                >
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={`Media ${item.media_id}`}
                      className='h-full w-full rounded object-cover'
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center rounded bg-muted text-xs font-bold text-muted-foreground'>
                      {item.media_id}
                    </div>
                  )}
                  <div className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white'>
                    {position}
                  </div>
                </div>
              )
            })}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('actions')} />
      ),
      cell: ({ row }) => <UtilitiesTableRowActions row={row} />,
      enableSorting: false,
    },
  ]
}
