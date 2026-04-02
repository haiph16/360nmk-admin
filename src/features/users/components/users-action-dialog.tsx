'use client'

import { z } from 'zod'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import api from '@/lib/axios'
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
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { roles } from '../data/data'
import { type User } from '../data/schema'

type UserActionDialogProps = {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UserActionDialogProps) {
  const { t } = useTranslation()

  const formSchema = z
    .object({
      firstName: z
        .string()
        .min(1, t('field_required', { field: t('first_name') })),
      lastName: z
        .string()
        .min(1, t('field_required', { field: t('last_name') })),
      username: z
        .string()
        .min(1, t('field_required', { field: t('username') })),
      phoneNumber: z
        .string()
        .min(1, t('field_required', { field: t('phone_number') })),
      email: z.string().email(t('field_required', { field: t('email') })),
      password: z.string().transform((pwd) => pwd.trim()),
      role: z.string().min(1, t('field_required', { field: t('role') })),
      confirmPassword: z.string().transform((pwd) => pwd.trim()),
      isEdit: z.boolean(),
    })
    .refine(
      (data) => {
        if (data.isEdit && !data.password) return true
        return data.password.length > 0
      },
      {
        message: t('field_required', { field: t('password') }),
        path: ['password'],
      }
    )
    .refine(
      ({ isEdit, password }) => {
        if (isEdit && !password) return true
        return password.length >= 8
      },
      {
        message: t('password_min_length'),
        path: ['password'],
      }
    )
    .refine(
      ({ isEdit, password }) => {
        if (isEdit && !password) return true
        return /[a-z]/.test(password)
      },
      {
        message: t('password_lowercase'),
        path: ['password'],
      }
    )
    .refine(
      ({ isEdit, password }) => {
        if (isEdit && !password) return true
        return /\d/.test(password)
      },
      {
        message: t('password_number'),
        path: ['password'],
      }
    )
    .refine(
      ({ isEdit, password, confirmPassword }) => {
        if (isEdit && !password) return true
        return password === confirmPassword
      },
      {
        message: t('passwords_dont_match'),
        path: ['confirmPassword'],
      }
    )
  type UserForm = z.infer<typeof formSchema>
  const isEdit = !!currentRow
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: UserForm) => api.post('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(t('user_created_success'))
      onOpenChange(false)
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError ? error.response?.data?.message : t('error')
      toast.error(message || t('error'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: UserForm) => api.patch(`/users/${currentRow?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(t('user_updated_success'))
      onOpenChange(false)
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError ? error.response?.data?.message : t('error')
      toast.error(message || t('error'))
    },
  })

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          firstName: currentRow.firstName || '',
          lastName: currentRow.lastName || '',
          username: currentRow.username,
          phoneNumber: currentRow.phoneNumber || '',
          email: currentRow.email,
          password: '',
          confirmPassword: '',
          isEdit,
        }
      : {
          firstName: '',
          lastName: '',
          username: '',
          phoneNumber: '',
          email: '',
          role: '',
          password: '',
          confirmPassword: '',
          isEdit,
        },
  })

  const onSubmit = (values: UserForm) => {
    if (isEdit) {
      updateMutation.mutate(values)
    } else {
      createMutation.mutate(values)
    }
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? t('edit_user') : t('add_new_user')}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? t('update_user_desc') : t('create_user_desc')}
          </DialogDescription>
        </DialogHeader>
        <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('username')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('username')}
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('email')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john.doe@gmail.com'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('phone_number')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='+123456789'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('role')}
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder={t('search_placeholder')}
                      className='col-span-4'
                      items={roles.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('password')}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='e.g., S3cur3P@ssw0rd'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('confirm_password')}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        disabled={!isPasswordTouched}
                        placeholder='e.g., S3cur3P@ssw0rd'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            form='user-form'
            loading={createMutation.isPending || updateMutation.isPending}
          >
            {t('save_changes')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
