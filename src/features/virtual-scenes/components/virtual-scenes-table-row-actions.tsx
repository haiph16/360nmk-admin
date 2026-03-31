import { Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { VirtualScene } from '../data/schema'
import { useVirtualScenesContext } from './virtual-scenes-provider'

interface VirtualScenesTableRowActionsProps {
  row: Row<VirtualScene>
}

export function VirtualScenesTableRowActions({
  row,
}: VirtualScenesTableRowActionsProps) {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow } = useVirtualScenesContext()

  return (
    <div className='flex gap-2'>
      <button
        onClick={() => {
          setCurrentRow(row.original)
          setOpen('edit')
        }}
        className='text-blue-600 hover:underline'
      >
        {t('edit')}
      </button>
      <button
        onClick={() => {
          setCurrentRow(row.original)
          setOpen('delete')
        }}
        className='text-red-600 hover:underline'
      >
        {t('delete')}
      </button>
    </div>
  )
}
