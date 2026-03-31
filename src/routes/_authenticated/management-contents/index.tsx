import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ManagementContents } from '@/features/management-contents'

const managementContentsSearchSchema = z.object({
  page: z.number().catch(1),
  pageSize: z.number().catch(10),
  name: z.string().optional().catch(''),
})

export type ManagementContentsSearch = z.infer<
  typeof managementContentsSearchSchema
>

export const Route = createFileRoute('/_authenticated/management-contents/')({
  validateSearch: (search) => managementContentsSearchSchema.parse(search),
  component: ManagementContents,
})
