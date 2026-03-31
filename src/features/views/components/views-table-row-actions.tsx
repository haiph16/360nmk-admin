import { Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { View } from '../data/schema'
import { useViewsContext } from './views-provider'

interface ViewsTableRowActionsProps {
  row: Row<View>
}

export function ViewsTableRowActions({ row }: ViewsTableRowActionsProps) {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow } = useViewsContext()

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
