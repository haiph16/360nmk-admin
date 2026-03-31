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
import type { Overview } from '../data/schema'
import { useUpdateOverview } from '../hooks/use-overviews'
import { useOverviewsContext } from './overviews-provider'

interface OverviewsEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentOverview: Overview | null
}

export function OverviewsEditDialog({
  open,
  onOpenChange,
  currentOverview,
}: OverviewsEditDialogProps) {
  const { t } = useTranslation()
  const { setOpen, setCurrentOverview } = useOverviewsContext()
  const updateOverview = useUpdateOverview()

  const [title, setTitle] = useState(currentOverview?.title || '')
  const [content, setContent] = useState(currentOverview?.content || '')
  const [mediaId] = useState(currentOverview?.media_id || 0)
  const pendingFileRef = useRef<File | null>(null)

  const handleSave = async () => {
    if (!currentOverview) return

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

      await updateOverview.mutateAsync({
        id: currentOverview.id,
        title,
        content,
        media_id: finalMediaId,
      })
      toast.success(t('save_success') || 'Saved successfully')
      onOpenChange(false)
      setOpen(null)
      setCurrentOverview(null)
      pendingFileRef.current = null
    } catch (err) {
      toast.error(t('save_error') || 'Error occurred')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{t('edit') || 'Edit'} Overview</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <label className='mb-2 block text-sm font-medium'>
              {t('title') || 'Title'}
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Enter overview title'
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
              isDisabled={updateOverview.isPending}
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium'>
              {t('content') || 'Content'}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='Enter overview content (HTML supported)'
              className='min-h-80 w-full rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none'
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={updateOverview.isPending}
          >
            {t('cancel') || 'Cancel'}
          </Button>
          <Button onClick={handleSave} disabled={updateOverview.isPending}>
            {updateOverview.isPending
              ? `${t('saving') || 'Saving'}...`
              : t('save') || 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
