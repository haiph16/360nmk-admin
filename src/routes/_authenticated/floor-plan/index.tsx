import z from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasPermission } from '@/lib/utils'
import { FloorPlan } from '@/features/floor-plan'

const floorPlanSearchSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(10),
})

export const Route = createFileRoute('/_authenticated/floor-plan/')({
  beforeLoad: async () => {
    if (!hasPermission('floor-plan.view')) {
      throw redirect({ to: '/sign-in' })
    }
  },
  validateSearch: (search) => floorPlanSearchSchema.parse(search),
  component: FloorPlan,
})
