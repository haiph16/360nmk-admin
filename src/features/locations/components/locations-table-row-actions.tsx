import { Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { Location } from '../data/schema'
import { useLocationsContext } from './locations-provider'

interface LocationsTableRowActionsProps {
  row: Row<Location>
}

export function LocationsTableRowActions({
  row,
}: LocationsTableRowActionsProps) {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow } = useLocationsContext()

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
