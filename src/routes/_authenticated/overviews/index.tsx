import z from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasPermission } from '@/lib/utils'
import { Overviews } from '@/features/overviews'

const overviewsSearchSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(10),
})

export const Route = createFileRoute('/_authenticated/overviews/')({
  beforeLoad: async () => {
    if (!hasPermission('overviews.view')) {
      throw redirect({ to: '/sign-in' })
    }
  },
  validateSearch: (search) => overviewsSearchSchema.parse(search),
  component: Overviews,
})
