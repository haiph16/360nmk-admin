import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { ImagePreviewDialog } from '@/components/image-preview-dialog'
import type { RegionLink } from '../data/schema'
import { useRegionLinksContext } from './region-links-provider'

interface RegionLinksViewProps {
  regionLink: RegionLink | null
}

export function RegionLinksView({ regionLink }: RegionLinksViewProps) {
  const { t } = useTranslation()
  const [previewOpen, setPreviewOpen] = useState(false)
  const { setOpen, setCurrentRegionLink } = useRegionLinksContext()

  if (!regionLink) {
    return (
      <div className='py-8 text-center'>
        <p className='text-muted-foreground'>{t('no_data') || 'No data'}</p>
      </div>
    )
  }

  const handleEditRegionLink = () => {
    if (regionLink) {
      setCurrentRegionLink(regionLink)
      setOpen('edit')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-lg border bg-card p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>
            {t('region_link_image') || 'Region Link Image'}
          </h3>
          <Button onClick={handleEditRegionLink}>{t('edit') || 'Edit'}</Button>
        </div>

        <div className='space-y-4'>
          {regionLink.thumbnail ? (
            <div className='space-y-2'>
              <button
                onClick={() => setPreviewOpen(true)}
                className='relative h-64 w-full overflow-hidden rounded-lg border hover:opacity-75'
              >
                <img
                  src={regionLink.thumbnail}
                  alt='Region Link'
                  className='h-full w-full object-contain'
                />
              </button>
              <ImagePreviewDialog
                open={previewOpen}
                onOpenChange={setPreviewOpen}
                imageUrl={
                  regionLink.large ||
                  regionLink.medium ||
                  regionLink.original ||
                  null
                }
                title='Region Link Image'
              />
            </div>
          ) : (
            <div className='flex h-64 w-full items-center justify-center rounded-lg border border-dashed bg-muted/50'>
              <p className='text-muted-foreground'>
                {t('no_image') || 'No image'}
              </p>
            </div>
          )}

          <div className='text-xs text-muted-foreground'>
            <p>
              {t('last_updated') || 'Last updated'}:{' '}
              {new Date(regionLink.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
