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
import { useDeleteManagementContent } from '../hooks/use-management-contents'
import { useManagementContentsContext } from './management-contents-provider'

interface ManagementContentsDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManagementContentsDeleteDialog({
  open,
  onOpenChange,
}: ManagementContentsDeleteDialogProps) {
  const { t } = useTranslation()
  const { currentRow, setOpen, setCurrentRow } = useManagementContentsContext()
  const { mutate: deleteContent, isPending } = useDeleteManagementContent()

  const handleDelete = () => {
    if (currentRow) {
      deleteContent(currentRow.id, {
        onSuccess: () => {
          onOpenChange(false)
          setOpen(null)
          setTimeout(() => setCurrentRow(null), 500)
        },
      })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('delete')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('delete_confirm_message') ||
              `Are you sure you want to delete "${currentRow?.name}"?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className='flex gap-2'>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
          >
            {isPending ? `${t('deleting')}...` : t('delete')}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
