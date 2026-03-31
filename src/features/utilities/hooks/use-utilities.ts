import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/axios'
import type {
  Utility,
  UtilityCreatePayload,
  UtilitiesResponse,
} from '../data/schema'

export function useUtilities(
  page?: number,
  pageSize?: number,
  search?: string
) {
  return useQuery({
    queryKey: ['utilities', page, pageSize, search],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (page !== undefined) params.append('page', String(page))
      if (pageSize !== undefined) params.append('limit', String(pageSize))
      if (search) params.append('search', search)

      const response = await api.get<UtilitiesResponse>(
        `/utilities?${params.toString()}`
      )
      return response.data
    },
    retry: 1,
  })
}

export function useUtility(id: number) {
  return useQuery({
    queryKey: ['utilities', id],
    queryFn: async () => {
      const response = await api.get<{ data: Utility }>(`/utilities/${id}`)
      return response.data.data
    },
    enabled: id > 0,
  })
}

export function useCreateUtility() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UtilityCreatePayload) => {
      const response = await api.post<{ data: Utility }>('/utilities', data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilities'] })
      toast.success('Utility created successfully')
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to create utility')
    },
  })
}

export function useUpdateUtility() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: Partial<UtilityCreatePayload>
    }) => {
      const response = await api.put<{ data: Utility }>(
        `/utilities/${id}`,
        data
      )
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilities'] })
      toast.success('Utility updated successfully')
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to update utility')
    },
  })
}

export function useDeleteUtility() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/utilities/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilities'] })
      toast.success('Utility deleted successfully')
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to delete utility')
    },
  })
}
