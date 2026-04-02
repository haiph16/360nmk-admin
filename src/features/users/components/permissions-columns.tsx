'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type Permission } from '../hooks/use-permissions'
import { PermissionsTableRowActions } from './permissions-table-row-actions'

interface ColumnProps {
  onEdit: (permission: Permission) => void
  onDelete: (permission: Permission) => void
  t: TFunction
}

export const getPermissionsColumns = ({
  onEdit,
  onDelete,
  t,
}: ColumnProps): ColumnDef<Permission>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('name')} />
    ),
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue('name')}</div>
    ),
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('description')} />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-md'>
        {row.getValue('description') || t('no_description')}
      </LongText>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <PermissionsTableRowActions
        row={row}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
]
