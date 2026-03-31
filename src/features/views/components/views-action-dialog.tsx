import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { apiUploadFile } from '@/lib/api-request'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ImageUpload } from '@/components/image-upload'
import type { View } from '../data/schema'
import { useCreateView, useUpdateView } from '../hooks/use-views'
import { useViewsContext } from './views-provider'

interface ViewsActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: View | null
}

export function ViewsActionDialog({
  open,
  onOpenChange,
  currentRow,
}: ViewsActionDialogProps) {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow } = useViewsContext()
  const createView = useCreateView()
  const updateView = useUpdateView()

  const isEdit = !!currentRow
  const [name, setName] = useState(currentRow?.name || '')
  const [url, setUrl] = useState(currentRow?.url || '')
  const [mediaId] = useState(currentRow?.media_id || null)
  const pendingFileRef = useRef<File | null>(null)

  const handleSave = async () => {
    try {
      let finalMediaId: number | null = mediaId

      // Upload ảnh tại đây, đúng lúc submit
      if (pendingFileRef.current) {
        const response = await apiUploadFile(
          '/media/upload',
          pendingFileRef.current
        )
        finalMediaId = response.data?.id ?? response.id ?? null
      }

      if (isEdit && currentRow) {
        await updateView.mutateAsync({
          id: currentRow.id,
          name,
          url,
          media_id: finalMediaId,
          createdAt: currentRow.createdAt,
          updatedAt: currentRow.updatedAt,
        })
        toast.success(t('save_success') || 'Saved successfully')
      } else {
        await createView.mutateAsync({
          name,
          url,
          media_id: finalMediaId,
        })
        toast.success(t('save_success') || 'Saved successfully')
      }
      onOpenChange(false)
      setOpen(null)
      setCurrentRow(null)
      pendingFileRef.current = null
    } catch (err) {
      toast.error(t('save_error') || 'Error occurred')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('edit') || 'Edit' : t('add') || 'Add'} View
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <label className='mb-2 block text-sm font-medium'>
              {t('name') || 'Name'}
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Enter view name'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium'>
              {t('url') || 'URL'}
            </label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder='Enter view URL'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium'>
              {t('image') || 'Image'}
            </label>
            <ImageUpload
              onFileSelect={(file) => {
                pendingFileRef.current = file
              }}
              isDisabled={createView.isPending || updateView.isPending}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={createView.isPending || updateView.isPending}
          >
            {t('cancel') || 'Cancel'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={createView.isPending || updateView.isPending}
          >
            {createView.isPending || updateView.isPending
              ? `${t('saving') || 'Saving'}...`
              : t('save') || 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
