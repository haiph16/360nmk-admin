import { Trash } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { View } from '../data/schema'
import { useDeleteAllViews } from '../hooks/use-views'

type ViewsPrimaryButtonsProps = {
  data: View[]
}

export function ViewsPrimaryButtons({ data }: ViewsPrimaryButtonsProps) {
  const { t } = useTranslation()
  const deleteAllViews = useDeleteAllViews()

  const handleDeleteAll = async () => {
    if (data.length === 0) {
      toast.info(t('no_items_to_delete') || 'No items to delete')
      return
    }

    const confirmed = window.confirm(
      `${t('confirm delete all') || 'Delete all'} ?`
    )
    if (!confirmed) return

    try {
      await deleteAllViews.mutateAsync()
      toast.success(`${data.length} ${t('deleted_successfully') || 'deleted'}`)
    } catch (err) {
      toast.error(t('delete_error') || 'Error deleting items')
    }
  }

  return (
    <Button
      variant='destructive'
      onClick={handleDeleteAll}
      disabled={deleteAllViews.isPending || data.length === 0}
      size='default'
    >
      <Trash />
      {deleteAllViews.isPending
        ? `${t('deleting') || 'Deleting'}...`
        : `${t('delete_all') || 'Delete All'}`}
    </Button>
  )
}
