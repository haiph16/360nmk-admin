import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useRegionLinksContext } from './region-links-provider'

export function RegionLinksPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen, setCurrentRegionLink } = useRegionLinksContext()

  const handleCreate = () => {
    // For region links, we create an empty/placeholder object to open the edit dialog
    setCurrentRegionLink({
      id: 1,
      original: null,
      large: null,
      medium: null,
      thumbnail: null,
      updatedAt: new Date().toISOString(),
    })
    setOpen('edit')
  }

  return (
    <Button onClick={handleCreate} size='sm' className='gap-2'>
      <Plus className='h-4 w-4' />
      {t('create_new') || 'Create New'}
    </Button>
  )
}
