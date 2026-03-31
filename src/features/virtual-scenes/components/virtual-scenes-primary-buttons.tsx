import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useVirtualScenesContext } from './virtual-scenes-provider'

export function VirtualScenesPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useVirtualScenesContext()

  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <Plus size={18} />
      <span>{t('add_virtual_scene') || 'Add Virtual Scene'}</span>
    </Button>
  )
}
