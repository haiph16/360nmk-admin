import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import type { ManagementContent } from '../data/schema'
import { ManagementContentsTableRowActions } from './management-contents-table-row-actions'

export function useManagementContentsColumns(
  t: any
): ColumnDef<ManagementContent>[] {
  return [
    {
      id: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('name') || 'Name'} />
      ),
      accessorKey: 'name',
      cell: ({ row }) => <span>{row.getValue('name')}</span>,
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      id: 'media',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('media') || 'Media'} />
      ),
      cell: ({ row }) => {
        const media = row.original.media
        const fileUrl = media?.urls?.original
        if (!fileUrl) {
          return <span className='text-muted-foreground'>-</span>
        }
        const fileName = fileUrl.split('/').pop() || 'Download'
        return (
          <a
            href={fileUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:underline'
          >
            {fileName}
          </a>
        )
      },
      enableSorting: false,
    },
    {
      id: 'actions',
      header: () => <span>{t('actions') || 'Actions'}</span>,
      cell: ({ row }) => <ManagementContentsTableRowActions row={row} />,
    },
  ]
}
