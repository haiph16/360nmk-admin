import { z } from 'zod'

export const mediaItemSchema = z.object({
  media_id: z.number(),
  position: z.number().int().nullable().optional(),
  media: z
    .object({
      id: z.number(),
      mime_type: z.string(),
      file_size: z.number(),
      urls: z.object({
        original: z.string(),
        large: z.string().optional(),
        medium: z.string().optional(),
        thumbnail: z.string().optional(),
      }),
    })
    .optional(),
})

export type MediaItem = z.infer<typeof mediaItemSchema>

export const utilitySchema = z.object({
  id: z.number(),
  name: z.string().nullable().optional(),
  parent_id: z.number().nullable().optional(),
  media_items: z.array(mediaItemSchema).nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Utility = z.infer<typeof utilitySchema>

export type UtilityCreatePayload = Omit<
  Utility,
  'id' | 'createdAt' | 'updatedAt'
>

export type Media = {
  id: number
  mime_type: string
  file_size: number
  urls: {
    original: string
    large?: string
    medium?: string
    thumbnail?: string
  }
}

export type UtilitiesResponse = {
  success: boolean
  message: string
  data: Utility[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
