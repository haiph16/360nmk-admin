import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/axios'
import type { OtherInfoResponse } from '../data/schema'

export function useOtherInfo() {
  return useQuery({
    queryKey: ['other-info'],
    queryFn: async () => {
      const response = await api.get<OtherInfoResponse>('/other-info')
      return response.data.data
    },
  })
}

export function useUpdateOtherInfo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.patch<OtherInfoResponse>('/other-info', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['other-info'] })
      toast.success('Other info updated successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to update other info'
      toast.error(message || 'Error updating other info')
    },
  })
}
