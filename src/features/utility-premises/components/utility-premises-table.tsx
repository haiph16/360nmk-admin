import { useState } from 'react'
import { JSX } from 'react'
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react'
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
import type { UtilityPremise } from '../data/schema'

interface UtilityPremisesTableProps {
  data: UtilityPremise[]
  onEdit: (premise: UtilityPremise) => void
  onDelete: (premise: UtilityPremise) => void
  onAddChild: (parentId: number) => void
  paginationMeta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  onPageChange?: (page: number) => void
}

export function UtilityPremisesTable({
  data,
  onEdit,
  onDelete,
  onAddChild,
  paginationMeta,
  onPageChange,
}: UtilityPremisesTableProps) {
  const { t } = useTranslation()
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedIds(newExpanded)
  }

  const renderRows = (
    items: UtilityPremise[],
    level: number = 0
  ): JSX.Element[] => {
    const rows: JSX.Element[] = []

    items.forEach((premise) => {
      const isExpanded = expandedIds.has(premise.id)
      const hasChildren = premise.children && premise.children.length > 0

      rows.push(
        <TableRow key={premise.id} className={level > 0 ? 'bg-muted/30' : ''}>
          <TableCell className='py-3'>
            <div style={{ paddingLeft: `${level * 24}px` }}>
              {hasChildren ? (
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-6 w-6 p-0'
                  onClick={() => toggleExpanded(premise.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className='h-4 w-4' />
                  ) : (
                    <ChevronRight className='h-4 w-4' />
                  )}
                </Button>
              ) : (
                <div className='h-6 w-6' />
              )}
            </div>
          </TableCell>
          <TableCell className='py-3'>
            {(() => {
              // Priority: media > image
              const mediaObj = premise.media
              const imageUrl = premise.image

              if (mediaObj) {
                return mediaObj.type === 'video' ? (
                  <video
                    src={mediaObj.url}
                    className='h-12 w-12 rounded object-cover'
                    controls={false}
                  />
                ) : (
                  <img
                    src={mediaObj.url}
                    alt={premise.name}
                    className='h-12 w-12 rounded object-cover'
                  />
                )
              }

              if (imageUrl) {
                return (
                  <img
                    src={imageUrl}
                    alt={premise.name}
                    className='h-12 w-12 rounded object-cover'
                  />
                )
              }

              return (
                <div className='flex h-12 w-12 items-center justify-center rounded border border-dashed bg-muted'>
                  <span className='text-xs text-muted-foreground'>-</span>
                </div>
              )
            })()}
          </TableCell>
          <TableCell className='font-medium'>{premise.name}</TableCell>
          <TableCell className='text-sm'>
            {premise.coordinatesX && premise.coordinatesY
              ? `${premise.coordinatesX}, ${premise.coordinatesY}`
              : '-'}
          </TableCell>
          <TableCell className='text-sm'>
            {new Date(premise.updatedAt).toLocaleString()}
          </TableCell>
          <TableCell className='text-right'>
            <div className='flex items-center justify-end gap-2'>
              <Button
                onClick={() => onAddChild(premise.id)}
                size='sm'
                variant='outline'
                className='h-8 px-2'
                title={t('add_child') || 'Add Child'}
              >
                <Plus className='h-4 w-4' />
              </Button>
              <Button
                onClick={() => onEdit(premise)}
                size='sm'
                variant='outline'
                className='h-8'
              >
                {t('edit') || 'Edit'}
              </Button>
              <Button
                onClick={() => onDelete(premise)}
                size='sm'
                variant='destructive'
                className='h-8 px-2'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      )

      if (isExpanded && hasChildren) {
        rows.push(...renderRows(premise.children, level + 1))
      }
    })

    return rows
  }

  return (
    <div className='space-y-4'>
      <div className='w-full'>
        <div className='rounded-lg border'>
          <Table>
            <TableHeader>
              <TableRow className='w-full bg-muted/50'>
                <TableHead className='w-12' />
                <TableHead className='w-20'>{t('image') || 'Image'}</TableHead>
                <TableHead className='min-w-48'>
                  {t('name') || 'Name'}
                </TableHead>
                <TableHead className='min-w-48'>
                  {t('coordinates') || 'Coordinates'}
                </TableHead>
                <TableHead>{t('last_updated') || 'Last Updated'}</TableHead>
                <TableHead className='text-right'>
                  {t('actions') || 'Actions'}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                renderRows(data)
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className='py-8 text-center'>
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

      {paginationMeta && (
        <div className='flex items-center justify-between'>
          <div className='text-sm text-muted-foreground'>
            {t('showing') || 'Showing'}{' '}
            {(paginationMeta.page - 1) * paginationMeta.limit + 1} to{' '}
            {Math.min(
              paginationMeta.page * paginationMeta.limit,
              paginationMeta.total
            )}{' '}
            of {paginationMeta.total} {t('results') || 'results'}
          </div>
          <div className='flex gap-2'>
            <Button
              onClick={() => onPageChange?.(paginationMeta.page - 1)}
              disabled={paginationMeta.page === 1}
              variant='outline'
              size='sm'
            >
              {t('previous') || 'Previous'}
            </Button>
            <div className='flex items-center gap-2'>
              {Array.from(
                { length: paginationMeta.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <Button
                  key={page}
                  onClick={() => onPageChange?.(page)}
                  variant={page === paginationMeta.page ? 'default' : 'outline'}
                  size='sm'
                  className='h-10 w-10 p-0'
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => onPageChange?.(paginationMeta.page + 1)}
              disabled={paginationMeta.page === paginationMeta.totalPages}
              variant='outline'
              size='sm'
            >
              {t('next') || 'Next'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
