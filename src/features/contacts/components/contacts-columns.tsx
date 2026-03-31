import { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { DataTableColumnHeader } from '@/components/data-table'
import type { Contact } from '../data/schema'
import { ContactsTableRowActions } from './contacts-table-row-actions'

export function useContactsColumns(
  t: ReturnType<typeof useTranslation>['t']
): ColumnDef<Contact>[] {
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
      id: 'address',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('address')} />
      ),
      accessorKey: 'address',
      enableSorting: true,
      cell: ({ row }) => {
        const address = row.getValue('address') as string | null
        return address ? (
          address
        ) : (
          <span className='text-muted-foreground'>-</span>
        )
      },
    },
    {
      id: 'phone',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('phone_number')} />
      ),
      accessorKey: 'phone',
      enableSorting: true,
      cell: ({ row }) => {
        const phone = row.getValue('phone') as string | null
        return phone ? phone : <span className='text-muted-foreground'>-</span>
      },
    },
    {
      id: 'website',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('website')} />
      ),
      accessorKey: 'website',
      enableSorting: true,
      cell: ({ row }) => {
        const website = row.getValue('website') as string | null
        return website ? (
          <a
            href={website}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:underline'
          >
            {website}
          </a>
        ) : (
          <span className='text-muted-foreground'>-</span>
        )
      },
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('actions')} />
      ),
      cell: ({ row }) => <ContactsTableRowActions row={row} />,
      enableSorting: false,
    },
  ]
}
