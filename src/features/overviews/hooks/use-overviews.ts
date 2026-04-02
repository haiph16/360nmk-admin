import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/axios'
import type { OverviewCreatePayload, OverviewResponse } from '../data/schema'

// ============== Overview ==============
export function useOverview() {
  return useQuery({
    queryKey: ['overview'],
    queryFn: async () => {
      const response = await api.get<OverviewResponse>('/overview')
      return response.data.data
    },
  })
}

export function useUpdateOverview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: OverviewCreatePayload) => {
      const response = await api.patch<OverviewResponse>('/overview', data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overview'] })
      toast.success('Overview updated successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to update overview'
      toast.error(message || 'Error updating overview')
    },
  })
}
