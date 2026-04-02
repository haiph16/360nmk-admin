import z from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasPermission } from '@/lib/utils'
import { RegionLinks } from '@/features/region-links'

const regionLinksSearchSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(10),
  name: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/region-links/')({
  beforeLoad: async () => {
    if (!hasPermission('region-links.view')) {
      throw redirect({ to: '/sign-in' })
    }
  },
  validateSearch: (search) => regionLinksSearchSchema.parse(search),
  component: RegionLinks,
})
