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
import { useDeleteProduct } from '../hooks/use-products'
import { useProductsContext } from './products-provider'

export function ProductsDeleteDialog() {
  const { t } = useTranslation()
  const { open, setOpen, currentRow } = useProductsContext()
  const deleteProduct = useDeleteProduct()

  const isOpen = open === 'delete'

  const handleConfirm = async () => {
    if (!currentRow) return

    await deleteProduct.mutateAsync(currentRow.id)
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
              'Are you sure you want to delete this product? This action cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className='flex justify-end gap-2'>
          <AlertDialogCancel disabled={deleteProduct.isPending}>
            {t('cancel') || 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteProduct.isPending}
            className='bg-red-600 hover:bg-red-700'
          >
            {deleteProduct.isPending
              ? t('deleting') || 'Deleting...'
              : t('delete') || 'Delete'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
