import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { OtherInfo } from '../data/schema'
import { useUpdateOtherInfo } from '../hooks/use-other-info'
import { useOtherInfoContext } from './provider'

const otherInfoFormSchema = z.object({
  website: z.string().nullable().optional(),
  link_maps: z.string().nullable().optional(),
})

type OtherInfoFormValues = z.infer<typeof otherInfoFormSchema>

type OtherInfoEditDialogProps = {
  data: OtherInfo | null
}

export function OtherInfoEditDialog({ data }: OtherInfoEditDialogProps) {
  const { t } = useTranslation()
  const { isEditOpen, setIsEditOpen } = useOtherInfoContext()
  const updateOtherInfo = useUpdateOtherInfo()

  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [instructionPreview, setInstructionPreview] = useState<string | null>(
    null
  )
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [instructionFile, setInstructionFile] = useState<File | null>(null)

  const mediaInputRef = useRef<HTMLInputElement>(null)
  const instructionInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<OtherInfoFormValues>({
    resolver: zodResolver(otherInfoFormSchema),
    defaultValues: {
      website: null,
      link_maps: null,
    },
  })

  useEffect(() => {
    if (isEditOpen && data) {
      form.reset({
        website: data.website || null,
        link_maps: data.link_maps || null,
      })
      setMediaPreview(data.thumbnail || null)
      setInstructionPreview(data.instruction_thumbnail || null)
      setMediaFile(null)
      setInstructionFile(null)
    }
  }, [isEditOpen, data, form])

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMediaFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setMediaPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInstructionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setInstructionFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setInstructionPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearMediaPreview = () => {
    setMediaFile(null)
    setMediaPreview(null)
    if (mediaInputRef.current) mediaInputRef.current.value = ''
  }

  const clearInstructionPreview = () => {
    setInstructionFile(null)
    setInstructionPreview(null)
    if (instructionInputRef.current) instructionInputRef.current.value = ''
  }

  const onSubmit = async (values: OtherInfoFormValues) => {
    try {
      const formData = new FormData()
      if (values.website) formData.append('website', values.website)
      if (values.link_maps) formData.append('link_maps', values.link_maps)
      if (mediaFile) formData.append('image', mediaFile)
      if (instructionFile) formData.append('instruction_image', instructionFile)

      await updateOtherInfo.mutateAsync(formData)
      setIsEditOpen(false)
    } catch {
      // Error already toasted by hooks
    }
  }

  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{t('edit_other_info') || 'Edit Other Info'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-4'>
              <h3 className='font-semibold'>{t('links') || 'Links'}</h3>
              <FormField
                control={form.control}
                name='website'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('website') || 'Website'}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://...'
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
                name='link_maps'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('link_maps') || 'Maps Link'}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://...'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='space-y-4'>
              <h3 className='font-semibold'>{t('image') || 'Media Links'}</h3>
              <FormItem>
                <FormLabel>{t('image') || 'Media Links Image'}</FormLabel>
                <div className='space-y-3'>
                  {mediaPreview && (
                    <div className='relative inline-block'>
                      <img
                        src={mediaPreview}
                        alt='Media preview'
                        className='h-40 w-40 rounded-md border object-cover'
                      />
                      <button
                        type='button'
                        onClick={clearMediaPreview}
                        className='absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600'
                      >
                        <X className='h-4 w-4' />
                      </button>
                    </div>
                  )}
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => mediaInputRef.current?.click()}
                    className='gap-2'
                  >
                    <ImagePlus className='h-4 w-4' />
                    {mediaFile
                      ? t('change') || 'Change'
                      : t('upload') || 'Upload'}
                  </Button>
                </div>
                <input
                  ref={mediaInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleMediaChange}
                  className='hidden'
                />
                <FormMessage />
              </FormItem>
            </div>

            <div className='space-y-4'>
              <h3 className='font-semibold'>
                {t('instruction_image') || 'Instruction Media'}
              </h3>
              <FormItem>
                <FormLabel>
                  {t('instruction_image') || 'Instruction Media Image'}
                </FormLabel>
                <div className='space-y-3'>
                  {instructionPreview && (
                    <div className='relative inline-block'>
                      <img
                        src={instructionPreview}
                        alt='Instruction preview'
                        className='h-40 w-40 rounded-md border object-cover'
                      />
                      <button
                        type='button'
                        onClick={clearInstructionPreview}
                        className='absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600'
                      >
                        <X className='h-4 w-4' />
                      </button>
                    </div>
                  )}
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => instructionInputRef.current?.click()}
                    className='gap-2'
                  >
                    <ImagePlus className='h-4 w-4' />
                    {instructionFile
                      ? t('change') || 'Change'
                      : t('upload') || 'Upload'}
                  </Button>
                </div>
                <input
                  ref={instructionInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleInstructionChange}
                  className='hidden'
                />
                <FormMessage />
              </FormItem>
            </div>

            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsEditOpen(false)}
                disabled={updateOtherInfo.isPending}
              >
                {t('cancel') || 'Cancel'}
              </Button>
              <Button type='submit' disabled={updateOtherInfo.isPending}>
                {updateOtherInfo.isPending
                  ? t('saving') || 'Saving...'
                  : t('save') || 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
