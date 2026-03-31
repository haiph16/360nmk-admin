import { z } from 'zod'

export const virtualSceneSchema = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type VirtualScene = z.infer<typeof virtualSceneSchema>
export const virtualSceneListSchema = z.array(virtualSceneSchema)
