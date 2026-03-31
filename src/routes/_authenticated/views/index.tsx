import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Views } from '@/features/views'

const viewsSearchSchema = z.object({
  page: z.number().catch(1),
  pageSize: z.number().catch(10),
  name: z.string().optional().catch(''),
})

export type ViewsSearch = z.infer<typeof viewsSearchSchema>

export const Route = createFileRoute('/_authenticated/views/')({
  validateSearch: (search) => viewsSearchSchema.parse(search),
  component: Views,
})
