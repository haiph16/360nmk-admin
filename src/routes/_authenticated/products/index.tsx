import z from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasPermission } from '@/lib/utils'
import { Products } from '@/features/products'

const productsSearchSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(10),
  name: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/products/')({
  beforeLoad: async () => {
    if (!hasPermission('products.view')) {
      throw redirect({ to: '/403' })
    }
  },
  validateSearch: (search) => productsSearchSchema.parse(search),
  component: Products,
})
