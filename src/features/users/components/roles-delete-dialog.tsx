import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useRoles, type Role } from '../hooks/use-roles'

interface RolesDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Role | null
}

export function RolesDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: RolesDeleteDialogProps) {
  const { t } = useTranslation()
  const { deleteMutation } = useRoles()

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
      title={t('edit_role').replace(t('edit'), t('delete'))} // Or just "Delete Role"
      desc={
        <p>
          {t('delete_role_confirm', { name: currentRow?.name })}
          <br />
          {t('action_cannot_be_undone')}
        </p>
      }
      confirmText={t('delete')}
      destructive
    />
  )
}
