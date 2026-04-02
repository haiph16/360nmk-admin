import { useState } from 'react'
import { z } from 'zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import api from '@/lib/axios'
import { decodeJWT } from '@/lib/jwt'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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

const formSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Please enter your password'),
  rememberMe: z.boolean(),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const { t } = useTranslation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      })

      console.log('Login response:', response)

      const { accessToken, refreshToken } = response.data.data

      if (!accessToken || !refreshToken) {
        throw new Error('Missing tokens in response')
      }

      // Decode JWT to extract user info
      const decodedToken = decodeJWT(accessToken)
      console.log('Decoded token:', decodedToken)

      if (!decodedToken) {
        throw new Error('Invalid access token')
      }

      // Create a user object from JWT payload with permissions
      const user = {
        id:
          decodedToken.user_id?.toString() ||
          decodedToken.sub?.toString() ||
          '0',
        email: decodedToken.email || data.email,
        username: decodedToken.username || data.email.split('@')[0],
        role: {
          name: decodedToken.role || 'user',
          slug: decodedToken.role || 'user',
          // Extract permissions from JWT token (array of permission names)
          permissions:
            (decodedToken.permissions || []).map(
              (perm: string | { id: string; name: string; slug: string }) => {
                if (typeof perm === 'string') {
                  return { id: perm, name: perm, slug: perm }
                }
                return perm
              }
            ) || [],
        },
      }

      // Set user, tokens, and remember me preference in store
      auth.setUser(user)
      auth.setAccessToken(accessToken, data.rememberMe)
      auth.setRefreshToken(refreshToken)
      auth.setRememberMe(data.rememberMe)

      toast.success(t('welcome_back', { name: user.username || user.email }))

      // Redirect to the stored location or default to dashboard
      const targetPath = redirectTo || '/'
      navigate({ to: targetPath, replace: true })
    } catch (error) {
      console.error('Login error:', error)
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        })
      }
      let message = t('login_failed')
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message
      }
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('email')}</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>{t('password')}</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='absolute inset-e-0 -top-0.5 text-sm font-medium text-muted-foreground hover:opacity-75'
              >
                {t('forgot_password')}
              </Link>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='rememberMe'
          render={({ field }) => (
            <FormItem className='flex items-center space-x-2'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className='mb-0 cursor-pointer font-normal'>
                {t('remember_me')}
              </FormLabel>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          {t('sign_in')}
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
        </div>
      </form>
    </Form>
  )
}
