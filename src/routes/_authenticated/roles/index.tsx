import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasPermission } from '@/lib/utils'
import { Roles } from '@/features/users'

export const Route = createFileRoute('/_authenticated/roles/')({
  beforeLoad: () => {
    if (!hasPermission('user_read')) {
      throw redirect({ to: '/403' })
    }
  },
  component: Roles,
})
