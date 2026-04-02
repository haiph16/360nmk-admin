import { MoreHorizontal } from 'lucide-react'
import type { Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { TypicalLayout } from '../data/schema'
import { useTypicalLayoutsContext } from './typical-layouts-provider'

export function TypicalLayoutsTableRowActions({ row }: { row: Row<TypicalLayout> }) {
  const { setOpen, setCurrentRow } = useTypicalLayoutsContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-44'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original)
            setOpen('edit')
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='text-red-600 focus:text-red-600'
          onClick={() => {
            setCurrentRow(row.original)
            setOpen('delete')
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

