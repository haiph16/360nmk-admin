import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useLocationsContext } from './locations-provider'

export function LocationsPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useLocationsContext()

  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <Plus size={18} />
      <span>{t('add_location') || 'Add Location'}</span>
    </Button>
  )
}
