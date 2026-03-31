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
import { useDeleteUtility } from '../hooks/use-utilities'
import { useUtilitiesContext } from './utilities-provider'

export function UtilitiesDeleteDialog() {
  const { t } = useTranslation()
  const { open, setOpen, currentRow } = useUtilitiesContext()
  const deleteUtility = useDeleteUtility()

  const isOpen = open === 'delete'

  const handleConfirm = async () => {
    if (!currentRow) return

    await deleteUtility.mutateAsync(currentRow.id)
    setOpen(null)
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(value) => !value && setOpen(null)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('confirm_delete') || 'Confirm Delete'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('delete_description') ||
              'Are you sure you want to delete this utility? This action cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className='flex justify-end gap-2'>
          <AlertDialogCancel disabled={deleteUtility.isPending}>
            {t('cancel') || 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteUtility.isPending}
            className='bg-red-600 hover:bg-red-700'
          >
            {deleteUtility.isPending
              ? t('deleting') || 'Deleting...'
              : t('delete') || 'Delete'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
