import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { usePermissions, type Permission } from '../hooks/use-permissions'

interface PermissionsDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Permission | null
}

export function PermissionsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: PermissionsDeleteDialogProps) {
  const { t } = useTranslation()
  const { deleteMutation } = usePermissions()

  const handleDelete = () => {
    if (!currentRow) return
    deleteMutation.mutate(currentRow.id, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={deleteMutation.isPending}
      title={t('edit_permission').replace(t('edit'), t('delete'))}
      desc={
        <p>
          {t('delete_permission_confirm', { name: currentRow?.name })}
          <br />
          {t('action_cannot_be_undone')}
        </p>
      }
      confirmText={t('delete')}
      destructive
    />
  )
}
