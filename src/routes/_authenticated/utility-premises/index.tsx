import z from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasPermission } from '@/lib/utils'
import { UtilityPremises } from '@/features/utility-premises/components/utility-premises-view'

const utilityPremisesSearchSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(10),
})

export const Route = createFileRoute('/_authenticated/utility-premises/')({
  beforeLoad: async () => {
    if (!hasPermission('utility-premises.view')) {
      throw redirect({ to: '/sign-in' })
    }
  },
  validateSearch: (search) => utilityPremisesSearchSchema.parse(search),
  component: UtilityPremises,
})
