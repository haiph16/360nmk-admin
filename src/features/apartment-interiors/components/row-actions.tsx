import type { Row } from '@tanstack/react-table'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ApartmentInterior } from '../data/schema'
import { useApartmentInteriorsContext } from './provider'

interface ApartmentInteriorsRowActionsProps {
  row: Row<ApartmentInterior>
}

export function ApartmentInteriorsRowActions({
  row,
}: ApartmentInteriorsRowActionsProps) {
  const { setOpen, setCurrentRow } = useApartmentInteriorsContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>•••
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original)
            setOpen('edit')
          }}
        >
          <Edit className='me-2 h-4 w-4' />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original)
            setOpen('delete')
          }}
          className='text-destructive'
        >
          <Trash2 className='me-2 h-4 w-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
