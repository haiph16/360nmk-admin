import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useApartmentInteriorsContext } from './provider'

export function ApartmentInteriorsPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useApartmentInteriorsContext()

  return (
    <div className='flex items-center gap-2'>
      <Button onClick={() => setOpen('add')} className='gap-2'>
        <Plus className='h-4 w-4' />
        {t('add') || 'Add'}
      </Button>
    </div>
  )
}
