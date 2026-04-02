import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import type { Overview } from '../data/schema'
import { useOverviewsContext } from './overviews-provider'

interface OverviewsViewProps {
  overview: Overview | null
}

export function OverviewsView({ overview }: OverviewsViewProps) {
  const { t } = useTranslation()
  const { setOpen, setCurrentOverview } = useOverviewsContext()

  if (!overview) {
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

  return (
    <div className='space-y-6'>
      <div className='rounded-lg border bg-card p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>
            {t('overview') || 'Overview'}
          </h3>
          <Button onClick={handleEditOverview}>{t('edit') || 'Edit'}</Button>
        </div>

        <div className='space-y-4'>
          <div>
            <p className='text-xs text-muted-foreground'>
              {t('link_360') || '360° Link'}
            </p>
            <p className='mt-1 font-medium break-all'>
              {overview.link_360 || (
                <span className='text-muted-foreground'>
                  {t('not_set') || 'Not set'}
                </span>
              )}
            </p>
          </div>

          <div className='text-xs text-muted-foreground'>
            <p>
              {t('last_updated') || 'Last updated'}:{' '}
              {new Date(overview.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
