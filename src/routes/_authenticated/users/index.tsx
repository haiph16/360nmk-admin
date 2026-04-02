import z from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasPermission } from '@/lib/utils'
import { Users } from '@/features/users'
import { roles } from '@/features/users/data/data'

const usersSearchSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(10),
  // Facet filters
  status: z
    .array(
      z.union([
        z.literal('active'),
        z.literal('inactive'),
        z.literal('invited'),
        z.literal('suspended'),
      ])
    )
    .optional()
    .catch([]),
  role: z
    .array(z.enum(roles.map((r) => r.value as (typeof roles)[number]['value'])))
    .optional()
    .catch([]),
  // Per-column text filter (example for username)
  username: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/users/')({
  beforeLoad: async () => {
    if (!hasPermission('user_read')) {
      throw redirect({ to: '/sign-in' })
    }
  },
  validateSearch: (search) => usersSearchSchema.parse(search),
  component: Users,
})
