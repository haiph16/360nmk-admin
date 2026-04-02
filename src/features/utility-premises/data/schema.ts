import { z } from 'zod'

const mediaSchema = z.object({
  id: z.number(),
  utilityPremiseId: z.number(),
  type: z.enum(['image', 'video']),
  url: z.string(),
  original: z.string().nullable().optional(),
  large: z.string().nullable().optional(),
  medium: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  createdAt: z.string(),
})

export const utilityPremiseSchema: z.ZodType<any, any, any> = z.object({
  id: z.number(),
  parentId: z.number().nullable().optional(),
  name: z.string(),
  image: z.string().nullable().optional(),
  coordinatesX: z.number().nullable().optional(),
  coordinatesY: z.number().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  media: mediaSchema.nullable().optional(),
  children: z.array(z.lazy(() => utilityPremiseSchema)).optional(),
  medias: z.array(z.any()).optional(),
})

export type UtilityPremise = z.infer<typeof utilityPremiseSchema>

export type UtilityPremiseCreatePayload = {
  parentId?: number | null
  name: string
  image?: string
  coordinatesX?: number | null
  coordinatesY?: number | null
  medias?: File[]
  child?: UtilityPremiseCreatePayload[]
}

export type UtilityPremiseUpdatePayload = UtilityPremiseCreatePayload

export type UtilityPremiseListResponse = {
  success: boolean
  message: string
  data: {
    data: UtilityPremise[]
    meta: {
      total: number
      page: number
      lastPage: number
      limit: number
    }
  }
}

export type UtilityPremiseResponse = {
  success: boolean
  message: string
  data: UtilityPremise
}
