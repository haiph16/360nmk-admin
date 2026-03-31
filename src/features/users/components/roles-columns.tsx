'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type Role } from '../hooks/use-roles'
import { RolesTableRowActions } from './roles-table-row-actions'

interface ColumnProps {
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
  onManagePermissions: (role: Role) => void
  t: TFunction
}

export const getRolesColumns = ({
  onEdit,
  onDelete,
  onManagePermissions,
  t,
}: ColumnProps): ColumnDef<Role>[] => [
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
    accessorKey: 'slug',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('slug')} />
    ),
    cell: ({ row }) => (
      <div className='font-mono text-xs'>{row.getValue('slug')}</div>
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
      <RolesTableRowActions
        row={row}
        onEdit={onEdit}
        onDelete={onDelete}
        onManagePermissions={onManagePermissions}
      />
    ),
  },
]
