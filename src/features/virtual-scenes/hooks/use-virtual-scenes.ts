import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPost, apiPut, apiDelete } from '@/lib/api-request'
import api from '@/lib/axios'
import type { VirtualScene } from '../data/schema'

interface VirtualScenesResponse {
  data: VirtualScene[]
  pagination?: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

export function useVirtualScenes(page?: number, pageSize?: number) {
  return useQuery({
    queryKey: ['virtualScenes', page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (page !== undefined) params.append('page', String(page))
      if (pageSize !== undefined) params.append('limit', String(pageSize))
      const response = await api.get<VirtualScenesResponse>(
        `/virtual-scenes?${params.toString()}`
      )
      return response.data
    },
  })
}

export function useVirtualSceneById(id: number) {
  return useQuery({
    queryKey: ['virtualScene', id],
    queryFn: async () => {
      const response = await api.get(`/virtual-scenes/${id}`)
      return response.data.data as VirtualScene
    },
    enabled: !!id,
  })
}

export function useCreateVirtualScene() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      data: Omit<VirtualScene, 'id' | 'createdAt' | 'updatedAt'>
    ) => {
      const response = await apiPost('/virtual-scenes', data)
      return response.data as VirtualScene
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualScenes'] })
    },
  })
}

export function useUpdateVirtualScene() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: Omit<VirtualScene, 'id' | 'createdAt' | 'updatedAt'>
    }) => {
      const response = await apiPut(`/virtual-scenes/${id}`, data)
      return response.data as VirtualScene
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualScenes'] })
    },
  })
}

export function useDeleteVirtualScene() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await apiDelete(`/virtual-scenes/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualScenes'] })
    },
  })
}
