import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import type { TypicalLayout } from '../data/schema'
import { TypicalLayoutsTableRowActions } from './typical-layouts-table-row-actions'

function getPreviewUrl(row: TypicalLayout) {
  return row.thumbnail ?? row.medium ?? row.large ?? row.original ?? null
}

export function getTypicalLayoutsColumns(t: any): ColumnDef<TypicalLayout>[] {
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
      id: 'preview',
      header: () => <div className='w-24'>{t('image') || 'Image'}</div>,
      cell: ({ row }) => {
        const url = getPreviewUrl(row.original)
        return (
          <div className='w-24'>
            {url ? (
              <img
                src={url}
                alt={row.original.name}
                className='h-12 w-20 rounded border object-cover'
              />
            ) : (
              <div className='h-12 w-20 rounded border bg-muted/30' />
            )}
          </div>
        )
      },
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
      cell: ({ row }) => <TypicalLayoutsTableRowActions row={row} />,
    },
  ]
}

