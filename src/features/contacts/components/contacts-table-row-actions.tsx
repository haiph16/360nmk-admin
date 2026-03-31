import { Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { Contact } from '../data/schema'
import { useContactsContext } from './contacts-provider'

interface ContactsTableRowActionsProps {
  row: Row<Contact>
}

export function ContactsTableRowActions({ row }: ContactsTableRowActionsProps) {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow } = useContactsContext()

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
