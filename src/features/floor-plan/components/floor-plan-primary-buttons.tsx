import { Building2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useFloorPlanContext } from './floor-plan-provider'

export function FloorPlanPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen, setCurrentBuilding, setCurrentFloor, setCurrentApartment } =
    useFloorPlanContext()

  return (
    <Button
      onClick={() => {
        setCurrentBuilding(null)
        setCurrentFloor(null)
        setCurrentApartment(null)
        setOpen('create-building')
      }}
    >
      <Building2 className='me-2 h-4 w-4' />
      {t('add_building') || 'Add building'}
    </Button>
  )
}
