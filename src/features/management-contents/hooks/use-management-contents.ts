import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api-request'
import type { ManagementContent } from '../data/schema'

export function useManagementContentsList() {
  return useQuery({
    queryKey: ['managementContentsList'],
    queryFn: async () => {
      const { data } = await apiGet('/management-contents')
      return data as ManagementContent[]
    },
  })
}

export function useCreateManagementContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (content: Omit<ManagementContent, 'id'>) => {
      // Exclude position and media fields from payload
      const { position, media, ...payload } = content
      const { data } = await apiPost('/management-contents', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managementContentsList'] })
    },
  })
}

export function useUpdateManagementContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (content: ManagementContent) => {
      // Exclude position and media fields from payload
      const { position, media, ...payload } = content
      const { data } = await apiPut(
        `/management-contents/${content.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managementContentsList'] })
    },
  })
}

export function useDeleteManagementContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiDelete(`/management-contents/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managementContentsList'] })
    },
  })
}
