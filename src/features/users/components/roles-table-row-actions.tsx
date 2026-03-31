'use client'

import { type Row } from '@tanstack/react-table'
import { Edit, MoreHorizontal, ShieldCheck, Trash } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Role } from '../hooks/use-roles'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
  onManagePermissions: (role: Role) => void
}

export function RolesTableRowActions<TData>({
  row,
  onEdit,
  onDelete,
  onManagePermissions,
}: DataTableRowActionsProps<TData>) {
  const { t } = useTranslation()
  const role = row.original as Role

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <MoreHorizontal className='h-4 w-4' />
          <span className='sr-only'>{t('open_menu')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[200px]'>
        <DropdownMenuItem onClick={() => onEdit(role)}>
          {t('edit')}
          <DropdownMenuShortcut>
            <Edit size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onManagePermissions(role)}>
          {t('manage_permissions')}
          <DropdownMenuShortcut>
            <ShieldCheck size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(role)}
          className='text-destructive! focus:bg-destructive/10!'
        >
          {t('delete')}
          <DropdownMenuShortcut>
            <Trash size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
