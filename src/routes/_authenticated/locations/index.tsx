import z from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasPermission } from '@/lib/utils'
import { Locations } from '@/features/locations'

const locationsSearchSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(10),
  name: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/locations/')({
  beforeLoad: async () => {
    if (!hasPermission('locations.view')) {
      throw redirect({ to: '/403' })
    }
  },
  validateSearch: (search) => locationsSearchSchema.parse(search),
  component: Locations,
})
