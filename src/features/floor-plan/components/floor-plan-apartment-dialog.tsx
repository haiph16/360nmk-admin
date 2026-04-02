import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  useCreateFloorPlanApartment,
  useUpdateFloorPlanApartment,
} from '../hooks/use-floor-plan'
import { useFloorPlanContext } from './floor-plan-provider'

export function FloorPlanApartmentDialog() {
  const { t } = useTranslation()
  const { open, setOpen, currentFloor, currentApartment, setCurrentApartment } =
    useFloorPlanContext()
  const createApt = useCreateFloorPlanApartment()
  const updateApt = useUpdateFloorPlanApartment()

  const isAdd = open === 'add-apartment'
  const isEdit = open === 'edit-apartment'
  const isOpen = isAdd || isEdit

  const [apartmentName, setApartmentName] = useState('')
  const [landArea, setLandArea] = useState('')
  const [landDirection, setLandDirection] = useState('')
  const [totalFloorArea, setTotalFloorArea] = useState('')
  const [svgData, setSvgData] = useState('')

  useEffect(() => {
    if (isEdit && currentApartment) {
      setApartmentName(currentApartment.apartmentName)
      setLandArea(
        typeof currentApartment.landArea === 'number'
          ? String(currentApartment.landArea)
          : currentApartment.landArea || ''
      )
      setLandDirection(currentApartment.landDirection || '')
      setTotalFloorArea(
        typeof currentApartment.totalFloorArea === 'number'
          ? String(currentApartment.totalFloorArea)
          : currentApartment.totalFloorArea || ''
      )
      setSvgData(currentApartment.svgData || '')
    }
    if (isAdd) {
      setApartmentName('')
      setLandArea('')
      setLandDirection('')
      setTotalFloorArea('')
      setSvgData('')
    }
  }, [isAdd, isEdit, currentApartment, open])

  const onSave = async () => {
    if (!apartmentName.trim()) return

    if (isAdd && currentFloor) {
      await createApt.mutateAsync({
        floorId: currentFloor.id,
        apartmentName: apartmentName.trim(),
        landArea: landArea.trim() || undefined,
        landDirection: landDirection.trim() || undefined,
        totalFloorArea: totalFloorArea.trim() || undefined,
        svgData: svgData.trim() || undefined,
      })
      setOpen(null)
      return
    }

    if (isEdit && currentApartment) {
      await updateApt.mutateAsync({
        id: currentApartment.id,
        data: {
          apartmentName: apartmentName.trim(),
          landArea: landArea.trim() ? landArea.trim() : null,
          landDirection: landDirection.trim() || null,
          totalFloorArea: totalFloorArea.trim() ? totalFloorArea.trim() : null,
          svgData: svgData.trim() || null,
        },
      })
      setOpen(null)
      setCurrentApartment(null)
    }
  }

  const pending = createApt.isPending || updateApt.isPending

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(null)
          setCurrentApartment(null)
        }
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {isAdd
              ? t('add_apartment') || 'Add apartment'
              : t('edit_apartment') || 'Edit apartment'}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-3'>
          <div>
            <Label>{t('apartment_name') || 'Apartment Name'}</Label>
            <Input
              className='mt-1'
              value={apartmentName}
              onChange={(e) => setApartmentName(e.target.value)}
            />
          </div>
          <div>
            <Label>{t('land_area') || 'Land Area'}</Label>
            <Input
              className='mt-1'
              value={landArea}
              onChange={(e) => setLandArea(e.target.value)}
              placeholder='e.g., 120 m²'
            />
          </div>
          <div>
            <Label>{t('land_direction') || 'Land Direction'}</Label>
            <Input
              className='mt-1'
              value={landDirection}
              onChange={(e) => setLandDirection(e.target.value)}
              placeholder='e.g., Đông Nam'
            />
          </div>
          <div>
            <Label>{t('total_floor_area') || 'Total Floor Area'}</Label>
            <Input
              className='mt-1'
              value={totalFloorArea}
              onChange={(e) => setTotalFloorArea(e.target.value)}
              placeholder='e.g., 332.03 m²'
            />
          </div>
          <div>
            <Label>{t('svg_data') || 'SVG Data'}</Label>
            <Input
              className='mt-1'
              value={svgData}
              onChange={(e) => setSvgData(e.target.value)}
              placeholder='SVG string'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(null)}>
            {t('cancel') || 'Cancel'}
          </Button>
          <Button
            onClick={() => void onSave()}
            disabled={pending || !apartmentName.trim()}
          >
            {pending ? t('saving') || 'Saving...' : t('save') || 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
