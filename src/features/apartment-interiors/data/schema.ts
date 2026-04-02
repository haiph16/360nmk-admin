import { z } from 'zod'

export const apartmentInteriorSchema = z.object({
  id: z.number(),
  name: z.string(),
  link_360: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type ApartmentInterior = z.infer<typeof apartmentInteriorSchema>
export type ApartmentInteriorCreatePayload = Omit<
  ApartmentInterior,
  'id' | 'createdAt' | 'updatedAt'
>

export type ApartmentInteriorsMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type ApartmentInteriorsResponse = {
  success: boolean
  message: string
  data: {
    data: ApartmentInterior[]
    meta: ApartmentInteriorsMeta
  }
}
