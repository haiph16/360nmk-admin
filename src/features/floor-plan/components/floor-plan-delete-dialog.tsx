import { useTranslation } from 'react-i18next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  useDeleteFloorPlanApartment,
  useDeleteFloorPlanBuilding,
  useDeleteFloorPlanFloor,
} from '../hooks/use-floor-plan'
import { useFloorPlanContext } from './floor-plan-provider'

export function FloorPlanDeleteDialog() {
  const { t } = useTranslation()
  const {
    open,
    setOpen,
    currentBuilding,
    setCurrentBuilding,
    currentFloor,
    setCurrentFloor,
    currentApartment,
    setCurrentApartment,
  } = useFloorPlanContext()

  const delBuilding = useDeleteFloorPlanBuilding()
  const delFloor = useDeleteFloorPlanFloor()
  const delApt = useDeleteFloorPlanApartment()

  const isOpen =
    open === 'delete-building' ||
    open === 'delete-floor' ||
    open === 'delete-apartment'

  const title =
    open === 'delete-building'
      ? t('delete_building') || 'Delete building'
      : open === 'delete-floor'
        ? t('delete_floor') || 'Delete floor'
        : t('delete_apartment') || 'Delete apartment'

  const label =
    open === 'delete-building'
      ? currentBuilding?.name
      : open === 'delete-floor'
        ? currentFloor?.name
        : currentApartment?.apartmentName

  const onConfirm = async () => {
    if (open === 'delete-building' && currentBuilding) {
      await delBuilding.mutateAsync(currentBuilding.id)
      setCurrentBuilding(null)
    } else if (open === 'delete-floor' && currentFloor) {
      await delFloor.mutateAsync(currentFloor.id)
      setCurrentFloor(null)
    } else if (open === 'delete-apartment' && currentApartment) {
      await delApt.mutateAsync(currentApartment.id)
      setCurrentApartment(null)
    }
    setOpen(null)
  }

  const pending =
    delBuilding.isPending || delFloor.isPending || delApt.isPending

  return (
    <AlertDialog open={isOpen} onOpenChange={(v) => !v && setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {(t('delete_confirm') || 'Delete') + (label ? ` "${label}"?` : '?')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className='flex justify-end gap-2'>
          <AlertDialogCancel disabled={pending}>
            {t('cancel') || 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
            onClick={() => void onConfirm()}
            disabled={pending}
          >
            {pending ? t('deleting') || 'Deleting...' : t('delete') || 'Delete'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
