import z from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasPermission } from '@/lib/utils'
import { Permissions } from '@/features/users'

const permissionsSearchSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(10),
  name: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/permissions/')({
  beforeLoad: async () => {
    if (!hasPermission('user_read')) {
      throw redirect({ to: '/sign-in' })
    }
  },
  validateSearch: (search) => permissionsSearchSchema.parse(search),
  component: Permissions,
})
