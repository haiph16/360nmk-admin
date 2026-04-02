import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
import {
  useCreateApartmentInterior,
  useUpdateApartmentInterior,
  useDeleteApartmentInterior,
} from '../hooks/use-apartment-interiors'
import { useApartmentInteriorsContext } from './provider'

const apartmentInteriorFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  link_360: z.string().nullable().optional(),
})

type ApartmentInteriorFormValues = z.infer<typeof apartmentInteriorFormSchema>

export function ApartmentInteriorsDialogs() {
  const { t } = useTranslation()
  const { open, setOpen, currentRow, setCurrentRow } =
    useApartmentInteriorsContext()

  const createInterior = useCreateApartmentInterior()
  const updateInterior = useUpdateApartmentInterior()
  const deleteInterior = useDeleteApartmentInterior()

  const form = useForm<ApartmentInteriorFormValues>({
    resolver: zodResolver(apartmentInteriorFormSchema),
    defaultValues: { name: '', link_360: null },
  })

  useEffect(() => {
    if (open === 'add') {
      form.reset({ name: '', link_360: null })
    } else if (open === 'edit' && currentRow) {
      form.reset({
        name: currentRow.name,
        link_360: currentRow.link_360 || null,
      })
    }
  }, [open, currentRow, form])

  const isAddOrEdit = open === 'add' || open === 'edit'
  const isLoading = createInterior.isPending || updateInterior.isPending

  const onSubmit = async (values: ApartmentInteriorFormValues) => {
    try {
      if (open === 'add') {
        await createInterior.mutateAsync({
          name: values.name,
          link_360: values.link_360 || null,
        })
      } else if (open === 'edit' && currentRow) {
        await updateInterior.mutateAsync({
          id: currentRow.id,
          data: {
            name: values.name,
            link_360: values.link_360 || null,
          },
        })
      }
      setOpen(null)
      setCurrentRow(null)
    } catch {
      // Error already toasted by hooks
    }
  }

  const handleDelete = async () => {
    if (currentRow) {
      try {
        await deleteInterior.mutateAsync(currentRow.id)
        setOpen(null)
        setCurrentRow(null)
      } catch {
        // Error already toasted by hooks
      }
    }
  }

  return (
    <>
      <Dialog open={isAddOrEdit} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>
              {open === 'add'
                ? t('add_apartment_interior') || 'Add Apartment Interior'
                : t('edit_apartment_interior') || 'Edit Apartment Interior'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('name') || 'Name'}</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='link_360'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('link_360') || '360 Link'}</FormLabel>
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

      <AlertDialog
        open={open === 'delete'}
        onOpenChange={(v) => !v && setOpen(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete') || 'Delete'}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('delete_confirm') ||
                'Are you sure you want to delete this item?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='flex justify-end gap-2'>
            <AlertDialogCancel>{t('cancel') || 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteInterior.isPending}
              className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
            >
              {deleteInterior.isPending
                ? t('deleting') || 'Deleting...'
                : t('delete') || 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
