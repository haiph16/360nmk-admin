import { z } from 'zod'

export const overviewSchema = z.object({
  id: z.number().default(1),
  link_360: z.string().optional().nullable(),
  updatedAt: z.string(),
})

export type Overview = z.infer<typeof overviewSchema>
export type OverviewCreatePayload = Pick<Overview, 'link_360'>

export type OverviewResponse = {
  success: boolean
  message: string
  data: Overview
}
