import z from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasPermission } from '@/lib/utils'
import { Utilities } from '@/features/utilities'

const utilitiesSearchSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(10),
  name: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/utilities/')({
  beforeLoad: async () => {
    if (!hasPermission('utilities.view')) {
      throw redirect({ to: '/403' })
    }
  },
  validateSearch: (search) => utilitiesSearchSchema.parse(search),
  component: Utilities,
})
