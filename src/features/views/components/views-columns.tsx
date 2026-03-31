import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { ImagePreviewDialog } from '@/components/image-preview-dialog'
import type { View } from '../data/schema'

export function useViewsColumns(t: any): ColumnDef<View>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type='checkbox'
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          className='cursor-pointer'
        />
      ),
      cell: ({ row }) => (
        <input
          type='checkbox'
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          className='cursor-pointer'
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      id: 'url',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('url') || 'URL'} />
      ),
      accessorKey: 'url',
      cell: ({ row }) => {
        const media = row.original.media
        const thumbnailUrl = media?.urls?.thumbnail
        const largeUrl = media?.urls?.large
        if (!thumbnailUrl) {
          return <span className='text-muted-foreground'>-</span>
        }

        return (
          <a
            href={row.getValue('thumbnail') as string}
            target='_blank'
            rel='noopener noreferrer'
            className='cursor-pointer text-blue-600 hover:underline'
          >
            <span className='truncate'>{largeUrl}</span>
          </a>
        )
      },
      enableSorting: true,
    },
    {
      id: 'media',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('media') || 'Media'} />
      ),
      cell: ({ row }) => {
        const [previewOpen, setPreviewOpen] = useState(false)
        const media = row.original.media
        const thumbnailUrl = media?.urls?.thumbnail
        const largeUrl = media?.urls?.large

        if (!thumbnailUrl) {
          return <span className='text-muted-foreground'>-</span>
        }

        return (
          <>
            <button
              onClick={() => setPreviewOpen(true)}
              className='relative h-12 w-12 overflow-hidden rounded hover:opacity-75'
            >
              <img
                src={thumbnailUrl}
                alt='Media thumbnail'
                className='h-full w-full object-cover'
              />
            </button>
            <ImagePreviewDialog
              open={previewOpen}
              onOpenChange={setPreviewOpen}
              imageUrl={largeUrl || thumbnailUrl}
              title={row.original.name || 'View'}
            />
          </>
        )
      },
      enableSorting: false,
    },
  ]
}
