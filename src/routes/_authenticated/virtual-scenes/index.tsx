import z from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasPermission } from '@/lib/utils'
import { VirtualScenes } from '@/features/virtual-scenes'

const virtualScenesSearchSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(10),
  name: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/virtual-scenes/')({
  beforeLoad: async () => {
    if (!hasPermission('virtualscenes.view')) {
      throw redirect({ to: '/403' })
    }
  },
  validateSearch: (search) => virtualScenesSearchSchema.parse(search),
  component: VirtualScenes,
})
