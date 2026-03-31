'use client'

import { useRef, useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { apiUploadFile } from '@/lib/api-request'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ImageUpload } from '@/components/image-upload'
import type { Location } from '../data/schema'
import { useCreateLocation, useUpdateLocation } from '../hooks/use-locations'
import { useLocationsContext } from './locations-provider'

type LocationActionDialogProps = {
  currentRow?: Location
  open: boolean
  onOpenChange: (open: boolean) => void
}

const locationFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  media_id: z.string().nullable().optional(),
})

type LocationFormValues = z.infer<typeof locationFormSchema>

export function LocationsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: LocationActionDialogProps) {
  const { t } = useTranslation()
  const { setOpen } = useLocationsContext()
  const createLocation = useCreateLocation()
  const updateLocation = useUpdateLocation()
  const isEdit = !!currentRow

  const pendingFileRef = useRef<File | null>(null)
  const removeExistingImageRef = useRef(false)

  // resetKey tăng thủ công sau submit để force re-mount ImageUpload
  // với initialPreview mới (undefined nếu vừa xóa ảnh)
  const [imageResetKey, setImageResetKey] = useState(0)
  // Preview thực tế để truyền vào ImageUpload sau khi submit
  const [currentPreview, setCurrentPreview] = useState(
    currentRow?.media
      ? {
          url: currentRow.media.urls.large || currentRow.media.urls.original,
          name: 'Location Image',
        }
      : undefined
  )

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: currentRow?.name ?? '',
      media_id: currentRow?.media_id?.toString() ?? null,
    },
  })

  const isPending = createLocation.isPending || updateLocation.isPending

  // Reset form và image khi mở dialog với row mới
  useEffect(() => {
    if (open) {
      form.reset({
        name: currentRow?.name ?? '',
        media_id: currentRow?.media_id?.toString() ?? null,
      })
      pendingFileRef.current = null
      removeExistingImageRef.current = false

      const preview = currentRow?.media
        ? {
            url: currentRow.media.urls.large || currentRow.media.urls.original,
            name: 'Location Image',
          }
        : undefined

      setCurrentPreview(preview)
      setImageResetKey((k) => k + 1)
    }
  }, [open, currentRow?.id]) // chỉ phụ thuộc vào id, không phụ thuộc open+currentRow cùng lúc

  async function onSubmit(values: LocationFormValues) {
    try {
      let mediaId: number | null = removeExistingImageRef.current
        ? null
        : values.media_id
          ? parseInt(values.media_id)
          : null

      if (pendingFileRef.current) {
        const response = await apiUploadFile(
          '/media/upload',
          pendingFileRef.current
        )
        mediaId = response.data?.id ?? response.id ?? null
      }

      if (isEdit && currentRow) {
        await updateLocation.mutateAsync({
          id: currentRow.id,
          data: { name: values.name, media_id: mediaId },
        })
        toast.success(
          t('location_updated_success') || 'Location updated successfully'
        )
      } else {
        await createLocation.mutateAsync({
          name: values.name,
          media_id: mediaId,
        })
        toast.success(
          t('location_created_success') || 'Location created successfully'
        )
      }

      // Cập nhật preview theo kết quả thực tế trước khi đóng dialog
      // Tránh ImageUpload bị re-mount với ảnh cũ
      if (removeExistingImageRef.current || !pendingFileRef.current) {
        if (removeExistingImageRef.current) {
          setCurrentPreview(undefined)
        }
      }
      setImageResetKey((k) => k + 1)

      onOpenChange(false)
      setOpen(null)
      pendingFileRef.current = null
      removeExistingImageRef.current = false
    } catch (err) {
      toast.error(t('location_error') || 'Error occurred')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t('edit_location') || 'Edit Location'
              : t('add_location') || 'Add Location'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t('edit_location_desc') || 'Update location details'
              : t('add_location_desc') || 'Add location details'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        t('enter_location_name') || 'Enter location name'
                      }
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>{t('image')} </FormLabel>
              <ImageUpload
                key={imageResetKey}
                onFileSelect={(file) => {
                  pendingFileRef.current = file
                }}
                onRemoveExisting={(removed) => {
                  removeExistingImageRef.current = removed
                }}
                isDisabled={isPending}
                initialPreview={currentPreview}
              />
            </FormItem>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  onOpenChange(false)
                  setOpen(null)
                }}
              >
                {t('cancel')}
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending ? t('loading') : isEdit ? t('update') : t('create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
