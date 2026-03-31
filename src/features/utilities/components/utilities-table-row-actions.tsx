import { Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { Utility } from '../data/schema'
import { useUtilitiesContext } from './utilities-provider'

interface UtilitiesTableRowActionsProps {
  row: Row<Utility>
}

export function UtilitiesTableRowActions({
  row,
}: UtilitiesTableRowActionsProps) {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow } = useUtilitiesContext()

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
