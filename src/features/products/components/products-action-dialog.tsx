import { useRef, useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { X, ImagePlus, GripVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { apiUploadFile } from '@/lib/api-request'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Product } from '../data/schema'
import {
  useCreateProduct,
  useUpdateProduct,
  useProducts,
} from '../hooks/use-products'
import { useProductsContext } from './products-provider'

const productFormSchema = z.object({
  name: z.string().nullable().optional(),
  parent_id: z.number().int().nullable().optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

interface UploadedMedia {
  media_id: number
  name: string
  url: string
  position: number
}

// ─── Sortable Media Item Component ─────────────────────────────────────────
function SortableMediaItem({
  media,
  isLoading,
  onRemove,
}: {
  media: UploadedMedia
  isLoading: boolean
  onRemove: (mediaId: number) => void
  t: any
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: media.media_id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded bg-white p-2 dark:bg-gray-800 ${
        isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''
      }`}
    >
      {/* Drag handle */}
      <button
        type='button'
        {...attributes}
        {...listeners}
        className='shrink-0 cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing dark:hover:text-gray-300'
      >
        <GripVertical size={20} />
      </button>

      {/* Image thumbnail */}
      <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded border border-gray-200 dark:border-gray-700'>
        <img
          src={media.url}
          alt={media.name}
          className='h-full w-full object-cover'
        />
      </div>

      {/* File name and info */}
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium'>{media.name}</p>
        <p className='text-xs text-gray-500'>ID: {media.media_id}</p>
      </div>

      {/* Position display */}
      <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded bg-blue-100 text-sm font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-200'>
        {media.position}
      </div>

      {/* Remove button */}
      <button
        type='button'
        onClick={() => onRemove(media.media_id)}
        disabled={isLoading}
        className='flex h-8 w-8 shrink-0 items-center justify-center rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50'
      >
        <X size={16} />
      </button>
    </div>
  )
}

export function ProductsActionDialog() {
  const { t } = useTranslation()
  const { open, setOpen, currentRow } = useProductsContext()
  const isEditMode = currentRow !== null && open === 'edit'
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const { data: productsData } = useProducts()
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { name: '', parent_id: null },
  })

  // ─── Populate form when editing ────────────────────────────────────────────
  useEffect(() => {
    if (isEditMode && currentRow) {
      form.reset({
        name: currentRow.name ?? '',
        parent_id: currentRow.parent_id ?? null,
      })

      const existingMedia: UploadedMedia[] = (currentRow.media_items ?? [])
        .slice()
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        .map((item, index) => ({
          media_id: item.media_id,
          name: `Media ${item.media_id}`,
          url:
            item.media?.urls?.thumbnail ??
            item.media?.urls?.medium ??
            item.media?.urls?.original ??
            '',
          position: item.position ?? index,
        }))

      setUploadedMedia(existingMedia)
    } else {
      form.reset({ name: '', parent_id: null })
      setUploadedMedia([])
      setPendingFiles([])
    }
  }, [isEditMode, currentRow, open])

  const parentId = form.watch('parent_id')

  // ─── Handle file selection (multiple) ──────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setPendingFiles((prev) => [...prev, ...files])
    e.target.value = ''
  }

  const removePending = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // ─── Upload all pending files ───────────────────────────────────────────────
  const handleUploadAll = async () => {
    if (!parentId) {
      toast.error(
        t('select_parent_first') || 'Please select a parent product first'
      )
      return
    }
    if (!pendingFiles.length) {
      toast.error(t('file_required') || 'Please select at least one file')
      return
    }

    setIsUploading(true)
    let successCount = 0
    let startPosition = uploadedMedia.length

    const results = await Promise.allSettled(
      pendingFiles.map((file) => apiUploadFile('/media/upload', file))
    )

    const newMedia: UploadedMedia[] = []

    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        const response = result.value
        const mediaId = (response as any)?.data?.id ?? (response as any)?.id
        if (mediaId) {
          newMedia.push({
            media_id: mediaId,
            name: pendingFiles[i].name,
            url: URL.createObjectURL(pendingFiles[i]),
            position: startPosition++,
          })
          successCount++
        }
      }
    })

    const failCount = results.length - successCount

    setUploadedMedia((prev) => [...prev, ...newMedia])
    setPendingFiles([])

    if (successCount > 0)
      toast.success(
        `${successCount} ${t('upload_success') || 'file(s) uploaded successfully'}`
      )
    if (failCount > 0)
      toast.error(
        `${failCount} ${t('upload_error') || 'file(s) failed to upload'}`
      )

    setIsUploading(false)
  }

  // ─── Remove already-uploaded media ─────────────────────────────────────────
  const removeMedia = (mediaId: number) => {
    setUploadedMedia((prev) => {
      const media = prev.find((m) => m.media_id === mediaId)
      // Only revoke object URLs created by us (not remote URLs)
      if (media?.url?.startsWith('blob:')) URL.revokeObjectURL(media.url)
      return prev
        .filter((m) => m.media_id !== mediaId)
        .map((m, index) => ({ ...m, position: index }))
    })
  }

  // ─── Handle drag end ───────────────────────────────────────────────────────
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setUploadedMedia((prev) => {
      const oldIndex = prev.findIndex((m) => m.media_id === active.id)
      const newIndex = prev.findIndex((m) => m.media_id === over.id)
      const reordered = arrayMove(prev, oldIndex, newIndex)
      return reordered.map((m, idx) => ({ ...m, position: idx }))
    })
  }

  // Setup sensors cho drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // ─── Submit ─────────────────────────────────────────────────────────────────
  const onSubmit = async (data: ProductFormValues) => {
    const media_items = uploadedMedia.map((m) => ({
      media_id: m.media_id,
      position: m.position,
    }))
    try {
      if (isEditMode && currentRow) {
        await updateProduct.mutateAsync({
          id: currentRow.id,
          data: {
            name: data.name ?? null,
            parent_id: data.parent_id ?? null,
            media_items,
          },
        })
      } else {
        await createProduct.mutateAsync({
          name: data.name ?? null,
          parent_id: data.parent_id ?? null,
          media_items,
        })
      }
      setOpen(null)
      setUploadedMedia([])
      setPendingFiles([])
    } catch (error) {
      console.error(error)
    }
  }

  const isOpen = open === 'add' || open === 'edit'
  const isLoading = createProduct.isPending || updateProduct.isPending
  const parentProducts = ((productsData?.data as Product[]) || []).filter(
    (p: Product) => p.id !== currentRow?.id
  )

  return (
    <Dialog open={isOpen} onOpenChange={(value) => !value && setOpen(null)}>
      <DialogContent className='max-w-full'>
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? t('edit_product') || 'Edit Product'
              : t('add_product') || 'Add Product'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormDescription>
                    {t('optional') || 'Optional'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Parent */}
            <FormField
              control={form.control}
              name='parent_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('parent_id') || 'Parent Product'}</FormLabel>
                  <Select
                    value={field.value?.toString() || ''}
                    onValueChange={(value) =>
                      field.onChange(value ? parseInt(value) : null)
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            t('select_parent') || 'Select parent product'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {parentProducts.map((product: Product) => (
                        <SelectItem
                          key={product.id}
                          value={product.id.toString()}
                        >
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t('optional') || 'Optional'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Media upload */}
            <div>
              <FormLabel>{t('media') || 'Media Items'}</FormLabel>
              <FormDescription className='mb-3'>
                {parentId
                  ? t('optional') || 'Optional'
                  : t('select_parent_to_upload') ||
                    'Select parent product first to upload media'}
              </FormDescription>

              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                multiple
                className='hidden'
                onChange={handleFileChange}
                disabled={!parentId || isUploading}
              />

              <button
                type='button'
                disabled={!parentId || isUploading}
                onClick={() => fileInputRef.current?.click()}
                className='flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-6 text-sm text-gray-500 transition hover:border-blue-400 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600'
              >
                <ImagePlus size={24} />
                <span>
                  {t('select_images') ||
                    'Click to select images (multiple allowed)'}
                </span>
              </button>

              {/* Pending files queue */}
              {pendingFiles.length > 0 && (
                <div className='mt-3 space-y-1'>
                  <p className='text-sm font-medium'>
                    {t('pending_upload') || 'Ready to upload'} (
                    {pendingFiles.length})
                  </p>
                  <ul className='max-h-32 overflow-y-auto rounded border border-gray-200 dark:border-gray-700'>
                    {pendingFiles.map((file, i) => (
                      <li
                        key={i}
                        className='flex items-center justify-between px-3 py-1.5 text-xs odd:bg-gray-50 dark:odd:bg-gray-800'
                      >
                        <span className='max-w-90 truncate'>{file.name}</span>
                        <button
                          type='button'
                          onClick={() => removePending(i)}
                          className='text-red-500 hover:text-red-700'
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={handleUploadAll}
                disabled={!pendingFiles.length || isUploading || !parentId}
                className='mt-2 w-full'
              >
                {!parentId
                  ? t('select_parent_first') || 'Select parent product first'
                  : isUploading
                    ? t('uploading') || 'Uploading...'
                    : `${t('upload') || 'Upload'} ${pendingFiles.length > 0 ? `(${pendingFiles.length})` : ''}`}
              </Button>

              {/* Uploaded media list with drag and drop */}
              {uploadedMedia.length > 0 && (
                <div className='mt-4 space-y-2'>
                  <p className='text-sm font-medium'>
                    {t('uploaded_media') || 'Uploaded Media'} (
                    {uploadedMedia.length})
                  </p>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={uploadedMedia.map((m) => m.media_id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className='space-y-2 rounded border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900'>
                        {[...uploadedMedia]
                          .sort((a, b) => a.position - b.position)
                          .map((media) => (
                            <SortableMediaItem
                              key={media.media_id}
                              media={media}
                              isLoading={isLoading}
                              onRemove={removeMedia}
                              t={t}
                            />
                          ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setOpen(null)
                  setUploadedMedia([])
                  setPendingFiles([])
                }}
                disabled={isLoading}
              >
                {t('cancel') || 'Cancel'}
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? t('saving') || 'Saving...' : t('save') || 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
