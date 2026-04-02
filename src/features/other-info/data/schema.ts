import { z } from 'zod'

export const otherInfoSchema = z.object({
  id: z.number().default(1),
  website: z.string().nullable().optional(),
  link_maps: z.string().nullable().optional(),
  original: z.string().nullable().optional(),
  large: z.string().nullable().optional(),
  medium: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  instruction_original: z.string().nullable().optional(),
  instruction_large: z.string().nullable().optional(),
  instruction_medium: z.string().nullable().optional(),
  instruction_thumbnail: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type OtherInfo = z.infer<typeof otherInfoSchema>
export type OtherInfoCreatePayload = Omit<
  OtherInfo,
  'createdAt' | 'updatedAt' | 'id'
>

export type OtherInfoResponse = {
  success: boolean
  message: string
  data: OtherInfo
}
