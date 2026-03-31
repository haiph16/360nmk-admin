import { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { DataTableColumnHeader } from '@/components/data-table'
import type { Location } from '../data/schema'
import { LocationsTableRowActions } from './locations-table-row-actions'

export function useLocationsColumns(
  t: ReturnType<typeof useTranslation>['t']
): ColumnDef<Location>[] {
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
      id: 'media',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('image')} />
      ),
      cell: ({ row }) => {
        const media = row.original.media as any
        if (!media?.urls?.thumbnail) {
          return <span className='text-muted-foreground'>-</span>
        }
        return (
          <img
            src={media.urls.thumbnail}
            alt='location'
            className='h-10 w-10 rounded object-cover'
          />
        )
      },
      enableSorting: false,
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('actions')} />
      ),
      cell: ({ row }) => <LocationsTableRowActions row={row} />,
      enableSorting: false,
    },
  ]
}
