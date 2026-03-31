import z from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasPermission } from '@/lib/utils'
import { Contacts } from '@/features/contacts'

const contactsSearchSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(10),
  name: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/contacts/')({
  beforeLoad: async () => {
    if (!hasPermission('contacts.view')) {
      throw redirect({ to: '/403' })
    }
  },
  validateSearch: (search) => contactsSearchSchema.parse(search),
  component: Contacts,
})
