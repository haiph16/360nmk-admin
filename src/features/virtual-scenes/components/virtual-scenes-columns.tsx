import { ColumnDef } from '@tanstack/react-table'
import { ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DataTableColumnHeader } from '@/components/data-table'
import type { VirtualScene } from '../data/schema'
import { VirtualScenesTableRowActions } from './virtual-scenes-table-row-actions'

export function useVirtualScenesColumns(
  t: ReturnType<typeof useTranslation>['t']
): ColumnDef<VirtualScene>[] {
  return [
    {
      id: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('name')} />
      ),
      accessorKey: 'name',
      enableSorting: true,
    },
    {
      id: 'url',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('url')} />
      ),
      accessorKey: 'url',
      enableSorting: true,
      cell: ({ row }) => {
        const url = row.getValue('url') as string | null
        if (!url) {
          return <span className='text-muted-foreground'>-</span>
        }
        return (
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='flex max-w-xs items-center gap-2 truncate text-blue-500 hover:underline'
          >
            <ExternalLink className='h-4 w-4 shrink-0' />
            <span className='truncate'>{url}</span>
          </a>
        )
      },
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('actions')} />
      ),
      cell: ({ row }) => <VirtualScenesTableRowActions row={row} />,
      enableSorting: false,
    },
  ]
}
