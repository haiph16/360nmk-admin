import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ImagePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageUrl: string | null
  title?: string
}

export function ImagePreviewDialog({
  open,
  onOpenChange,
  imageUrl,
  title,
}: ImagePreviewDialogProps) {
  const { t } = useTranslation()

  if (!imageUrl) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl'>
        <DialogHeader>
          <DialogTitle>
            {title || t('image_preview') || 'Image Preview'}
          </DialogTitle>
        </DialogHeader>
        <div className='flex items-center justify-center'>
          <img
            src={imageUrl}
            alt={title || 'Preview'}
            className='max-h-[70vh] max-w-full rounded-lg object-contain'
          />
        </div>
        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            {t('close') || 'Close'}
          </Button>
          <a
            href={imageUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90'
          >
            {t('open_in_new_tab') || 'Open in new tab'}
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
