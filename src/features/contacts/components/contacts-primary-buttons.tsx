import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useContactsContext } from './contacts-provider'

export function ContactsPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useContactsContext()

  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <Plus size={18} />
      <span>{t('add_contact') || 'Add Contact'}</span>
    </Button>
  )
}
