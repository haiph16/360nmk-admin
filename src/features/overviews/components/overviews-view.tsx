import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { ImagePreviewDialog } from '@/components/image-preview-dialog'
import type { Overview, CompanyInfo } from '../data/schema'
import { useOverviewsContext } from './overviews-provider'

interface OverviewsViewProps {
  overview: Overview | null
  companyInfo: CompanyInfo | null
}

export function OverviewsView({ overview, companyInfo }: OverviewsViewProps) {
  const { t } = useTranslation()
  const [previewOpen, setPreviewOpen] = useState(false)
  const { setOpen, setCurrentOverview, setCurrentCompanyInfo } =
    useOverviewsContext()

  if (!overview && !companyInfo) {
    return (
      <div className='py-8 text-center'>
        <p className='text-muted-foreground'>{t('no_data') || 'No data'}</p>
      </div>
    )
  }

  const handleEditOverview = () => {
    if (overview) {
      setCurrentOverview(overview)
      setOpen('edit')
    }
  }

  const handleEditCompanyInfo = () => {
    if (companyInfo) {
      setCurrentCompanyInfo(companyInfo)
      setOpen('edit-company')
    }
  }

  return (
    <div className='space-y-6'>
      {/* Company Info Section */}
      {companyInfo && (
        <div className='rounded-lg border bg-card p-6'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-lg font-semibold'>
              {t('company_info') || 'Company Info'}
            </h3>
            <Button onClick={handleEditCompanyInfo} size='sm'>
              {t('edit') || 'Edit'}
            </Button>
          </div>
          <div className='space-y-3'>
            <div>
              <p className='text-xs text-muted-foreground'>
                {t('company_name') || 'Company Name'}
              </p>
              <p className='font-medium'>{companyInfo.name}</p>
            </div>
            <div>
              <p className='text-xs text-muted-foreground'>
                {t('hotline') || 'Hotline'}
              </p>
              <p className='font-medium'>{companyInfo.hotline}</p>
            </div>
          </div>
        </div>
      )}

      {/* Overview Content Section */}
      {overview && (
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold'>{overview.title}</h3>
            <Button onClick={handleEditOverview}>{t('edit') || 'Edit'}</Button>
          </div>

          {overview.media && (
            <div className='space-y-2'>
              <button
                onClick={() => setPreviewOpen(true)}
                className='relative h-64 w-full overflow-hidden rounded-lg border hover:opacity-75'
              >
                <img
                  src={
                    overview.media.urls?.medium ||
                    overview.media.urls?.thumbnail
                  }
                  alt={overview.title}
                  className='h-full w-full object-contain'
                />
              </button>
              <ImagePreviewDialog
                open={previewOpen}
                onOpenChange={setPreviewOpen}
                imageUrl={
                  overview.media.urls?.large ||
                  overview.media.urls?.medium ||
                  null
                }
                title={overview.title}
              />
            </div>
          )}

          <div
            className='prose prose-sm max-w-none rounded-lg border bg-card p-6'
            dangerouslySetInnerHTML={{ __html: overview.content }}
          />

          <div className='text-xs text-muted-foreground'>
            <p>
              {t('last_updated') || 'Last updated'}:{' '}
              {new Date(overview.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
