import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
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
import { usePermissions, type Permission } from '../hooks/use-permissions'

type PermissionsActionDialogProps = {
  currentRow?: Permission
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PermissionsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: PermissionsActionDialogProps) {
  const { t } = useTranslation()
  const isEdit = !!currentRow
  const { createMutation, updateMutation } = usePermissions()

  const formSchema = z.object({
    name: z.string().min(1, t('field_required', { field: t('name') })),
    description: z.string().optional(),
  })

  type PermissionForm = z.infer<typeof formSchema>

  const form = useForm<PermissionForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          name: currentRow.name,
          description: currentRow.description || '',
        }
      : {
          name: '',
          description: '',
        },
  })

  const onSubmit = (data: PermissionForm) => {
    if (isEdit) {
      updateMutation.mutate(
        { id: currentRow.id, ...data },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset()
          },
        }
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
        },
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        form.reset()
      }}
    >
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('edit_permission') : t('add_new_permission')}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? t('update_permission_desc') : t('create_permission_desc')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='permission-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('name')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('description')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('description')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type='submit'
            form='permission-form'
            loading={createMutation.isPending || updateMutation.isPending}
          >
            {isEdit ? t('save_changes') : t('create_permission')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
