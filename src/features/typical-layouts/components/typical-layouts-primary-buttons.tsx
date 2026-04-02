import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useTypicalLayoutsContext } from './typical-layouts-provider'

export function TypicalLayoutsPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow } = useTypicalLayoutsContext()

  return (
    <Button
      onClick={() => {
        setCurrentRow(null)
        setOpen('add')
      }}
    >
      <Plus className='me-2 h-4 w-4' />
      {t('add') || 'Add'}
    </Button>
  )
}

