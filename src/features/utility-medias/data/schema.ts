import { z } from 'zod'

export const utilityMediaSchema = z.object({
  id: z.number(),
  utilityPremiseId: z.number(),
  type: z.enum(['image', 'video']),
  url: z.string().nullable().optional(),
  original: z.string().nullable().optional(),
  large: z.string().nullable().optional(),
  medium: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  createdAt: z.string(),
})

export type UtilityMedia = z.infer<typeof utilityMediaSchema>
export type UtilityMediaCreatePayload = Omit<UtilityMedia, 'id' | 'createdAt'>

export type UtilityMediaResponse = {
  success: boolean
  message: string
  data: UtilityMedia[]
}
