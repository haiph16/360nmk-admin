import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { Location } from '../data/schema'
import { useDeleteLocation } from '../hooks/use-locations'
import { useLocationsContext } from './locations-provider'

type LocationDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Location
}

export function LocationsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: LocationDeleteDialogProps) {
  const { t } = useTranslation()
  const { setOpen } = useLocationsContext()
  const deleteLocation = useDeleteLocation()

  const handleDelete = async () => {
    try {
      await deleteLocation.mutateAsync(currentRow.id)
      toast.success(
        t('location_deleted_success') || 'Location deleted successfully'
      )
      onOpenChange(false)
      setOpen(null)
    } catch (err) {
      toast.error(t('location_delete_error') || 'Failed to delete location')
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={deleteLocation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle className='me-2 mb-1 inline-block' />
          {t('delete_location')}
        </span>
      }
      desc={
        t('delete_confirm') ||
        'Are you sure you want to delete this location? This action cannot be undone.'
      }
    />
  )
}
