import { z } from 'zod'

export const contactSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  website: z.string().nullable(),
  hotline: z.string().nullable(),
  position: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Contact = z.infer<typeof contactSchema>
export const contactListSchema = z.array(contactSchema)
