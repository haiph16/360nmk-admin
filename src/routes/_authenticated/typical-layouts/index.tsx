import z from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasPermission } from '@/lib/utils'
import { TypicalLayouts } from '@/features/typical-layouts'

const typicalLayoutsSearchSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(10),
})

export const Route = createFileRoute('/_authenticated/typical-layouts/')({
  beforeLoad: async () => {
    if (!hasPermission('typical-layouts.view')) {
      throw redirect({ to: '/sign-in' })
    }
  },
  validateSearch: (search) => typicalLayoutsSearchSchema.parse(search),
  component: TypicalLayouts,
})
