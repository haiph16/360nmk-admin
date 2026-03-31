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
import type { Contact } from '../data/schema'
import { useCreateContact, useUpdateContact } from '../hooks/use-contacts'
import { useContactsContext } from './contacts-provider'

type ContactActionDialogProps = {
  currentRow?: Contact
  open: boolean
  onOpenChange: (open: boolean) => void
}

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  hotline: z.string().nullable().optional(),
  position: z.string().nullable().optional(),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export function ContactsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: ContactActionDialogProps) {
  const { t } = useTranslation()
  const { setOpen } = useContactsContext()
  const createContact = useCreateContact()
  const updateContact = useUpdateContact()
  const isEdit = !!currentRow

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: currentRow?.name ?? '',
      address: currentRow?.address ?? '',
      phone: currentRow?.phone ?? '',
      website: currentRow?.website ?? '',
      hotline: currentRow?.hotline ?? '',
      position: currentRow?.position ?? '',
    },
  })

  async function onSubmit(values: ContactFormValues) {
    try {
      if (isEdit && currentRow) {
        await updateContact.mutateAsync({
          id: currentRow.id,
          data: {
            name: values.name,
            address: values.address || null,
            phone: values.phone || null,
            website: values.website || null,
            hotline: values.hotline || null,
            position: values.position || null,
          },
        })
        toast.success(
          t('contact_updated_success') || 'Contact updated successfully'
        )
      } else {
        await createContact.mutateAsync({
          name: values.name,
          address: values.address || null,
          phone: values.phone || null,
          website: values.website || null,
          hotline: values.hotline || null,
          position: values.position || null,
        })
        toast.success(
          t('contact_created_success') || 'Contact created successfully'
        )
      }
      onOpenChange(false)
      setOpen(null)
      form.reset()
    } catch (err) {
      toast.error(t('contact_error') || 'Error occurred')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-screen overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t('edit_contact') || 'Edit Contact'
              : t('add_contact') || 'Add Contact'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t('edit_contact_desc') || 'Update contact details'
              : t('add_contact_desc') || 'Add contact details'}
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
                        t('enter_contact_name') || 'Enter contact name'
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
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('address')} </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('enter_address') || 'Enter address'}
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
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('phone')} </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('enter_phone') || 'Enter phone'}
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
              name='website'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('website')} </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('enter_website') || 'Enter website'}
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
              name='hotline'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('hotline')} </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('enter_hotline') || 'Enter hotline'}
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
              name='position'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('position')} </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('enter_position') || 'Enter position'}
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
                disabled={createContact.isPending || updateContact.isPending}
              >
                {createContact.isPending || updateContact.isPending
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
