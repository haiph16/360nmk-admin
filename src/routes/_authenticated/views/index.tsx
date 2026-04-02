import { z } from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasPermission } from '@/lib/utils'
import { Views } from '@/features/views'

const viewsSearchSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(10),
  name: z.string().optional().catch(''),
})

export type ViewsSearch = z.infer<typeof viewsSearchSchema>

export const Route = createFileRoute('/_authenticated/views/')({
  beforeLoad: async () => {
    if (!hasPermission('views.view')) {
      throw redirect({ to: '/sign-in' })
    }
  },
  validateSearch: (search) => viewsSearchSchema.parse(search),
  component: Views,
})
