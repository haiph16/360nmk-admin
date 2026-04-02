import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { RegionLink } from '../data/schema'
import { useRegionLinksContext } from './region-links-provider'

interface RegionLinksTableProps {
  data: RegionLink | null
}

export function RegionLinksTable({ data }: RegionLinksTableProps) {
  const { t } = useTranslation()
  const { setOpen, setCurrentRegionLink } = useRegionLinksContext()
  const handleEdit = () => {
    if (data) {
      setCurrentRegionLink(data)
      setOpen('edit')
    }
  }

  return (
    <div className='w-full'>
      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow className='bg-muted/50'>
              <TableHead className='w-20'>
                {t('thumbnail') || 'Thumbnail'}
              </TableHead>
              <TableHead className='w-16'>{t('id') || 'ID'}</TableHead>
              <TableHead>{t('last_updated') || 'Last Updated'}</TableHead>
              <TableHead className='w-24 text-right'>
                {t('actions') || 'Actions'}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data ? (
              <TableRow>
                <TableCell className='py-3'>
                  {data.thumbnail ? (
                    <img
                      src={data.thumbnail}
                      alt='Region Link Thumbnail'
                      className='h-12 w-12 rounded object-cover'
                    />
                  ) : (
                    <div className='flex h-12 w-12 items-center justify-center rounded border border-dashed bg-muted'>
                      <span className='text-xs text-muted-foreground'>-</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className='font-medium'>{data.id}</TableCell>
                <TableCell className='text-sm'>
                  {new Date(data.updatedAt).toLocaleString()}
                </TableCell>
                <TableCell className='text-right'>
                  <Button
                    onClick={handleEdit}
                    size='sm'
                    variant='outline'
                    className='h-8'
                  >
                    {t('edit') || 'Edit'}
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={4} className='py-8 text-center'>
                  <p className='text-muted-foreground'>
                    {t('no_data') || 'No data available'}
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
