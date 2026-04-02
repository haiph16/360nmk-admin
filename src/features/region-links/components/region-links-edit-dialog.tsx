import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { ImageUpload } from '@/components/image-upload'
import type { RegionLink } from '../data/schema'
import { useUpdateRegionLink } from '../hooks/use-region-links'
import { useRegionLinksContext } from './region-links-provider'

interface RegionLinksEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRegionLink: RegionLink | null
}

export function RegionLinksEditDialog({
  open,
  onOpenChange,
  currentRegionLink,
}: RegionLinksEditDialogProps) {
  const { t } = useTranslation()
  const { setOpen, setCurrentRegionLink } = useRegionLinksContext()
  const updateRegionLink = useUpdateRegionLink()
  const pendingFileRef = useRef<File | null>(null)

  const handleSave = async () => {
    try {
      if (!pendingFileRef.current) {
        toast.error(t('select_image') || 'Please select an image')
        return
      }

      await updateRegionLink.mutateAsync(pendingFileRef.current)
      toast.success(t('save_success') || 'Saved successfully')
      onOpenChange(false)
      setOpen(null)
      setCurrentRegionLink(null)
      pendingFileRef.current = null
    } catch (err) {
      toast.error(t('save_error') || 'Error occurred')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>{t('edit') || 'Edit'} Region Link Image</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <label className='mb-2 block text-sm font-medium'>
              {t('image') || 'Image'}
            </label>
            <ImageUpload
              onFileSelect={(file) => {
                pendingFileRef.current = file
              }}
              isDisabled={updateRegionLink.isPending}
            />
            <p className='mt-1 text-xs text-muted-foreground'>
              {t('upload_region_link_image') ||
                'Upload a new region link image'}
            </p>
          </div>

          {currentRegionLink?.thumbnail && (
            <div>
              <p className='mb-2 text-xs font-medium text-muted-foreground'>
                {t('current_image') || 'Current Image'}
              </p>
              <img
                src={currentRegionLink.thumbnail}
                alt='Current'
                className='h-40 w-full rounded-lg object-contain'
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={updateRegionLink.isPending}
          >
            {t('cancel') || 'Cancel'}
          </Button>
          <Button onClick={handleSave} disabled={updateRegionLink.isPending}>
            {updateRegionLink.isPending
              ? `${t('saving') || 'Saving'}...`
              : t('save') || 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
