import { z } from 'zod'

export const regionLinkSchema = z.object({
  id: z.number().default(1),
  original: z.string().nullable().optional(),
  large: z.string().nullable().optional(),
  medium: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  updatedAt: z.string(),
})

export type RegionLink = z.infer<typeof regionLinkSchema>
export type RegionLinkCreatePayload = Omit<RegionLink, 'updatedAt'>

export type RegionLinkResponse = {
  success: boolean
  message: string
  data: RegionLink
}
