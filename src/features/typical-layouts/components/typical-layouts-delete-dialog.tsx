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
import { useDeleteTypicalLayout } from '../hooks/use-typical-layouts'
import { useTypicalLayoutsContext } from './typical-layouts-provider'

function getPreviewUrl(row: any) {
  return row?.thumbnail ?? row?.medium ?? row?.large ?? row?.original ?? null
}

export function TypicalLayoutsDeleteDialog() {
  const { t } = useTranslation()
  const { open, setOpen, currentRow } = useTypicalLayoutsContext()
  const deleteTypicalLayout = useDeleteTypicalLayout()

  const isOpen = open === 'delete'
  const url = currentRow ? getPreviewUrl(currentRow) : null

  const handleConfirm = async () => {
    if (!currentRow) return

    await deleteTypicalLayout.mutateAsync({
      id: currentRow.id,
      name: currentRow.name,
      original: currentRow.original ?? null,
      large: currentRow.large ?? null,
      medium: currentRow.medium ?? null,
      thumbnail: currentRow.thumbnail ?? null,
    })
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
              'Are you sure you want to delete this typical layout? This action cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {currentRow && (
          <div className='mt-2 flex items-center gap-3 rounded border bg-muted/20 p-3'>
            <div className='h-14 w-20 shrink-0 overflow-hidden rounded border bg-muted/30'>
              {url ? (
                <img
                  src={url}
                  alt={currentRow.name}
                  className='h-full w-full object-cover'
                />
              ) : null}
            </div>
            <div className='min-w-0'>
              <p className='truncate text-sm font-medium'>{currentRow.name}</p>
              <p className='text-xs text-muted-foreground'>ID: {currentRow.id}</p>
            </div>
          </div>
        )}

        <div className='flex justify-end gap-2'>
          <AlertDialogCancel disabled={deleteTypicalLayout.isPending}>
            {t('cancel') || 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteTypicalLayout.isPending}
            className='bg-red-600 hover:bg-red-700'
          >
            {deleteTypicalLayout.isPending
              ? t('deleting') || 'Deleting...'
              : t('delete') || 'Delete'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

