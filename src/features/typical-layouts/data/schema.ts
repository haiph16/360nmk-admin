import { z } from 'zod'

export const typicalLayoutSchema = z.object({
  id: z.number(),
  name: z.string(),
  original: z.string().nullable().optional(),
  large: z.string().nullable().optional(),
  medium: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type TypicalLayout = z.infer<typeof typicalLayoutSchema>
export type TypicalLayoutCreatePayload = Omit<
  TypicalLayout,
  'id' | 'createdAt' | 'updatedAt'
>

export type TypicalLayoutsMeta = {
  total: number
  page: number
  lastPage: number
  limit: number
}

export type TypicalLayoutsResponse = {
  success: boolean
  message: string
  data: {
    data: TypicalLayout[]
    meta: TypicalLayoutsMeta
  }
}
