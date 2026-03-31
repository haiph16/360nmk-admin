import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { VirtualScene } from '../data/schema'
import { useDeleteVirtualScene } from '../hooks/use-virtual-scenes'
import { useVirtualScenesContext } from './virtual-scenes-provider'

type VirtualSceneDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: VirtualScene
}

export function VirtualScenesDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: VirtualSceneDeleteDialogProps) {
  const { t } = useTranslation()
  const { setOpen } = useVirtualScenesContext()
  const deleteVirtualScene = useDeleteVirtualScene()

  const handleDelete = async () => {
    try {
      await deleteVirtualScene.mutateAsync(currentRow.id)
      toast.success(
        t('virtual_scene_deleted_success') ||
          'Virtual Scene deleted successfully'
      )
      onOpenChange(false)
      setOpen(null)
    } catch (err) {
      toast.error(
        t('virtual_scene_delete_error') || 'Failed to delete virtual scene'
      )
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={deleteVirtualScene.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle className='me-2 mb-1 inline-block' />
          {t('delete_virtual_scene')}
        </span>
      }
      desc={
        t('delete_confirm') ||
        'Are you sure you want to delete this virtual scene? This action cannot be undone.'
      }
    />
  )
}
