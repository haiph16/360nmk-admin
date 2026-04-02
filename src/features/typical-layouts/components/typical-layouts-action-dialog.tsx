import { useEffect, useMemo, useRef, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
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
  useCreateTypicalLayout,
  useUpdateTypicalLayout,
} from '../hooks/use-typical-layouts'
import { useTypicalLayoutsContext } from './typical-layouts-provider'

const typicalLayoutFormSchema = z.object({
  name: z.string().min(1),
})

type TypicalLayoutFormValues = z.infer<typeof typicalLayoutFormSchema>

export function TypicalLayoutsActionDialog() {
  const { t } = useTranslation()
  const { open, setOpen, currentRow, setCurrentRow } =
    useTypicalLayoutsContext()
  const isEditMode = currentRow !== null && open === 'edit'

  const createTypicalLayout = useCreateTypicalLayout()
  const updateTypicalLayout = useUpdateTypicalLayout()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<TypicalLayoutFormValues>({
    resolver: zodResolver(typicalLayoutFormSchema),
    defaultValues: { name: '' },
  })

  useEffect(() => {
    if (isEditMode && currentRow) {
      form.reset({ name: currentRow.name ?? '' })
      const existing =
        currentRow.thumbnail ??
        currentRow.medium ??
        currentRow.large ??
        currentRow.original ??
        null
      setPreviewUrl(existing)
      setSelectedFile(null)
    } else if (open === 'add') {
      form.reset({ name: '' })
      setPreviewUrl(null)
      setSelectedFile(null)
      setCurrentRow(null)
    }
  }, [isEditMode, currentRow, open])

  // Cleanup created object URLs
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const isOpen = open === 'add' || open === 'edit'
  const isLoading =
    createTypicalLayout.isPending || updateTypicalLayout.isPending

  const dialogTitle = useMemo(() => {
    if (isEditMode) return t('edit') || 'Edit'
    return t('add') || 'Add'
  }, [isEditMode, t])

  const handlePickFile = (file: File | null) => {
    setSelectedFile(file)
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  const onSubmit = async (values: TypicalLayoutFormValues) => {
    try {
      const formData = new FormData()
      formData.append('name', values.name)

      if (isEditMode && currentRow) {
        if (selectedFile) {
          formData.append('image', selectedFile)
        }
        await updateTypicalLayout.mutateAsync({
          id: currentRow.id,
          data: formData,
        })
      } else {
        if (!selectedFile) {
          toast.error(t('image_required') || 'Image is required')
          return
        }
        formData.append('image', selectedFile)
        await createTypicalLayout.mutateAsync(formData)
      }

      setOpen(null)
      setSelectedFile(null)
      setPreviewUrl(null)
      setCurrentRow(null)
    } catch (e) {
      // errors already toasted by hooks
      console.error(e)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(value) => !value && setOpen(null)}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>
            {dialogTitle} {t('typical_layout') || 'Typical Layout'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name') || 'Name'}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    {t('required') || 'Required'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>{t('image') || 'Image'}</FormLabel>
              <FormDescription className='mb-3'>
                {isEditMode
                  ? t('optional') || 'Optional'
                  : t('required') || 'Required'}
              </FormDescription>

              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  handlePickFile(file)
                  e.target.value = ''
                }}
                disabled={isLoading}
              />

              <div className='flex gap-3'>
                <button
                  type='button'
                  disabled={isLoading}
                  onClick={() => fileInputRef.current?.click()}
                  className='flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-6 text-sm text-gray-500 transition hover:border-blue-400 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600'
                >
                  <ImagePlus size={24} />
                  <span>{t('select_image') || 'Click to select an image'}</span>
                </button>

                <div className='relative h-24 w-32 overflow-hidden rounded border bg-muted/30'>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt='preview'
                      className='h-full w-full object-cover'
                    />
                  ) : null}
                </div>
              </div>

              {(selectedFile || previewUrl) && (
                <div className='mt-2 flex items-center justify-between rounded border bg-muted/20 px-3 py-2 text-xs'>
                  <span className='truncate'>
                    {selectedFile?.name ||
                      (previewUrl ? t('current_image') || 'Current image' : '')}
                  </span>
                  <button
                    type='button'
                    className='text-red-600 hover:text-red-700'
                    onClick={() => handlePickFile(null)}
                    disabled={isLoading}
                  >
                    <X className='h-4 w-4' />
                  </button>
                </div>
              )}
            </div>

            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(null)}
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
