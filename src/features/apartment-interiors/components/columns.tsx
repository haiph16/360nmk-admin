import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import type { ApartmentInterior } from '../data/schema'
import { ApartmentInteriorsRowActions } from './row-actions'

export function getApartmentInteriorsColumns(
  t: any
): ColumnDef<ApartmentInterior>[] {
  return [
    {
      accessorKey: 'id',
      header: () => <div className='w-16'>{t('id') || 'ID'}</div>,
      cell: ({ row }) => (
        <div className='w-16 font-mono text-xs text-muted-foreground'>
          {row.original.id}
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: () => t('name') || 'Name',
      cell: ({ row }) => (
        <div className='max-w-[420px] truncate font-medium'>
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: 'link_360',
      header: () => t('link_360') || '360 Link',
      cell: ({ row }) => {
        const link = row.original.link_360
        return link ? (
          <a
            href={link}
            target='_blank'
            rel='noopener noreferrer'
            className='max-w-xs truncate text-blue-600 hover:underline'
          >
            {t('view') || 'View'}
          </a>
        ) : (
          <span className='text-muted-foreground'>-</span>
        )
      },
    },
    {
      accessorKey: 'updatedAt',
      header: () => t('updated_at') || 'Updated',
      cell: ({ row }) => (
        <Button variant='ghost' size='sm' className='px-0 text-xs'>
          {new Date(row.original.updatedAt).toLocaleString()}
        </Button>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => <ApartmentInteriorsRowActions row={row} />,
    },
  ]
}
