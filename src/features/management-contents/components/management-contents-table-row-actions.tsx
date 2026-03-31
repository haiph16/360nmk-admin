import { Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { ManagementContent } from '../data/schema'
import { useManagementContentsContext } from './management-contents-provider'

interface ManagementContentsTableRowActionsProps {
  row: Row<ManagementContent>
}

export function ManagementContentsTableRowActions({
  row,
}: ManagementContentsTableRowActionsProps) {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow } = useManagementContentsContext()

  return (
    <div className='flex gap-2'>
      <button
        onClick={() => {
          setCurrentRow(row.original)
          setOpen('edit')
        }}
        className='text-blue-600 hover:underline'
      >
        {t('edit') || 'Edit'}
      </button>
      <button
        onClick={() => {
          setCurrentRow(row.original)
          setOpen('delete')
        }}
        className='text-red-600 hover:underline'
      >
        {t('delete') || 'Delete'}
      </button>
    </div>
  )
}
