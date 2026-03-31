import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  apiUploadFile,
} from '@/lib/api-request'
import type { View } from '../data/schema'

interface ViewsResponse {
  data: View[]
  pagination?: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

export function useViewsList(page?: number, pageSize?: number) {
  return useQuery({
    queryKey: ['viewsList', page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (page !== undefined) params.append('page', String(page))
      if (pageSize !== undefined) params.append('limit', String(pageSize))
      const response = await apiGet<ViewsResponse>(
        `/views?${params.toString()}`
      )
      return response
    },
  })
}

export function useCreateView() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (view: Omit<View, 'id'>) => {
      // Exclude position and media fields from payload
      const { position, media, ...payload } = view
      const { data } = await apiPost('/views', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['viewsList'] })
    },
  })
}

export function useUpdateView() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (view: View) => {
      // Exclude position and media fields from payload
      const { position, media, ...payload } = view
      const { data } = await apiPut(`/views/${view.id}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['viewsList'] })
    },
  })
}

export function useDeleteView() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiDelete(`/views/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['viewsList'] })
    },
  })
}

export function useDeleteAllViews() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiDelete('/views')
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['viewsList'] })
    },
  })
}

export type BatchUploadParam = {
  name: string
  url: string
  media_id: number | null
}

export function useBatchUploadViews() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: BatchUploadParam[]) => {
      const results = []
      for (const param of params) {
        const { data } = await apiPut('/views/batch-update', param)
        results.push(data)
      }
      return results
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['viewsList'] })
    },
  })
}

export interface BatchUploadFile {
  name: string
  file: File
  url?: string
}

export function useBatchUploadFilesWithViews() {
  const queryClient = useQueryClient()
  const createView = useCreateView()

  return useMutation({
    mutationFn: async (files: BatchUploadFile[]) => {
      const sortedFiles = [...files].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true })
      )

      const results = []
      for (const file of sortedFiles) {
        // Step 1: Upload file → get media_id
        const uploadResponse = await apiUploadFile('/media/upload', file.file)
        const mediaId =
          (uploadResponse as any)?.data?.id ?? (uploadResponse as any)?.id

        // Step 2: Create view with media_id
        const viewData = await createView.mutateAsync({
          name: file.name,
          url: file.url || '',
          media_id: mediaId,
        })

        results.push(viewData)
      }

      return results
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['viewsList'] })
    },
  })
}
