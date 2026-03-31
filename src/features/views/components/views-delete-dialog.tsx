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
import { useDeleteView } from '../hooks/use-views'
import { useViewsContext } from './views-provider'

interface ViewsDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewsDeleteDialog({
  open,
  onOpenChange,
}: ViewsDeleteDialogProps) {
  const { t } = useTranslation()
  const { currentRow, setOpen, setCurrentRow } = useViewsContext()
  const { mutate: deleteView, isPending } = useDeleteView()

  const handleDelete = () => {
    if (currentRow) {
      deleteView(currentRow.id, {
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
