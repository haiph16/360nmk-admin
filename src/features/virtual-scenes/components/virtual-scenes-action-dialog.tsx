'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
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
import type { VirtualScene } from '../data/schema'
import {
  useCreateVirtualScene,
  useUpdateVirtualScene,
} from '../hooks/use-virtual-scenes'
import { useVirtualScenesContext } from './virtual-scenes-provider'

type VirtualSceneActionDialogProps = {
  currentRow?: VirtualScene
  open: boolean
  onOpenChange: (open: boolean) => void
}

const virtualSceneFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('URL must be valid').min(1, 'URL is required'),
})

type VirtualSceneFormValues = z.infer<typeof virtualSceneFormSchema>

export function VirtualScenesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: VirtualSceneActionDialogProps) {
  const { t } = useTranslation()
  const { setOpen } = useVirtualScenesContext()
  const createVirtualScene = useCreateVirtualScene()
  const updateVirtualScene = useUpdateVirtualScene()
  const isEdit = !!currentRow

  const form = useForm<VirtualSceneFormValues>({
    resolver: zodResolver(virtualSceneFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: currentRow?.name ?? '',
      url: currentRow?.url ?? '',
    },
  })

  async function onSubmit(values: VirtualSceneFormValues) {
    try {
      if (isEdit && currentRow) {
        await updateVirtualScene.mutateAsync({
          id: currentRow.id,
          data: {
            name: values.name,
            url: values.url,
          },
        })
        toast.success(
          t('virtual_scene_updated_success') ||
            'Virtual Scene updated successfully'
        )
      } else {
        await createVirtualScene.mutateAsync({
          name: values.name,
          url: values.url,
        })
        toast.success(
          t('virtual_scene_created_success') ||
            'Virtual Scene created successfully'
        )
      }
      onOpenChange(false)
      setOpen(null)
      form.reset()
    } catch (err) {
      toast.error(t('virtual_scene_error') || 'Error occurred')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t('edit_virtual_scene') || 'Edit Virtual Scene'
              : t('add_virtual_scene') || 'Add Virtual Scene'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t('edit_virtual_scene_desc') || 'Update virtual scene details'
              : t('add_virtual_scene_desc') || 'Add virtual scene details'}
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
                        t('enter_virtual_scene_name') ||
                        'Enter virtual scene name'
                      }
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='url'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('url')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('enter_url') || 'Enter URL'}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              <Button
                type='submit'
                disabled={
                  createVirtualScene.isPending || updateVirtualScene.isPending
                }
              >
                {createVirtualScene.isPending || updateVirtualScene.isPending
                  ? t('loading')
                  : isEdit
                    ? t('update')
                    : t('create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
