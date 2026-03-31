import { z } from 'zod'

export type Media = {
  id: number
  mime_type: string
  file_size: number
  width?: number
  height?: number
  urls: {
    original: string
    large?: string
    medium?: string
    thumbnail?: string
  }
}

export const locationSchema = z.object({
  id: z.number(),
  name: z.string(),
  position: z.number().optional(),
  media_id: z.number().nullable().optional(),
  media: z.any().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Location = z.infer<typeof locationSchema> & {
  media?: Media | null
}
export const locationListSchema = z.array(locationSchema)
