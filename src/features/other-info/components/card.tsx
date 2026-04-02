import { Edit2, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { OtherInfo } from '../data/schema'
import { useOtherInfoContext } from './provider'

type OtherInfoCardProps = {
  data: OtherInfo | null
  isLoading?: boolean
}

export function OtherInfoCard({ data, isLoading }: OtherInfoCardProps) {
  const { t } = useTranslation()
  const { setIsEditOpen } = useOtherInfoContext()

  if (isLoading) {
    return <div>{t('loading') || 'Loading...'}</div>
  }

  if (!data) {
    return <div>{t('no_data') || 'No data'}</div>
  }

  const hasData =
    data.thumbnail ||
    data.instruction_thumbnail ||
    data.website ||
    data.link_maps

  if (!hasData) {
    return (
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0'>
          <div>
            <CardTitle>{t('other_info') || 'Other Info'}</CardTitle>
            <CardDescription>
              {t('manage_other_info') || 'Manage general information'}
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsEditOpen(true)}
            size='sm'
            className='gap-2'
          >
            <Edit2 className='h-4 w-4' />
            {t('edit') || 'Edit'}
          </Button>
        </CardHeader>
        <CardContent>
          <div className='py-8 text-center text-muted-foreground'>
            {t('no_data') || 'No data. Click edit to add information.'}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <div>
          <CardTitle>{t('other_info') || 'Other Info'}</CardTitle>
          <CardDescription>
            {t('manage_other_info') || 'Manage general information'}
          </CardDescription>
        </div>
        <Button onClick={() => setIsEditOpen(true)} size='sm' className='gap-2'>
          <Edit2 className='h-4 w-4' />
          {t('edit') || 'Edit'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {/* Links Section */}
          {(data.website || data.link_maps) && (
            <div className='space-y-3 border-b pb-4'>
              <h3 className='font-semibold'>{t('links') || 'Links'}</h3>
              {data.website && (
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>
                    {t('website') || 'Website'}:
                  </span>
                  <a
                    href={data.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-1 text-blue-600 hover:underline'
                  >
                    {data.website.substring(0, 40)}...
                    <ExternalLink className='h-3 w-3' />
                  </a>
                </div>
              )}
              {data.link_maps && (
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>
                    {t('link_maps') || 'Maps Link'}:
                  </span>
                  <a
                    href={data.link_maps}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-1 text-blue-600 hover:underline'
                  >
                    {data.link_maps.substring(0, 40)}...
                    <ExternalLink className='h-3 w-3' />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Image Thumbnails - 2 Columns */}
          {(data.thumbnail || data.instruction_thumbnail) && (
            <div className='space-y-3'>
              <h3 className='font-semibold'>{t('images') || 'Images'}</h3>
              <div className='grid grid-cols-2 gap-4'>
                {data.thumbnail && (
                  <div className='flex flex-col items-center gap-2'>
                    <img
                      src={data.thumbnail}
                      alt='Thumbnail'
                      className='h-40 w-40 rounded-md border object-cover shadow-sm'
                    />
                    <span className='text-xs text-gray-600'>
                      {t('thumbnail') || 'Thumbnail'}
                    </span>
                  </div>
                )}
                {data.instruction_thumbnail && (
                  <div className='flex flex-col items-center gap-2'>
                    <img
                      src={data.instruction_thumbnail}
                      alt='Instruction Thumbnail'
                      className='h-40 w-40 rounded-md border object-cover shadow-sm'
                    />
                    <span className='text-xs text-gray-600'>
                      {t('instruction_thumbnail') || 'Instruction Thumbnail'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
