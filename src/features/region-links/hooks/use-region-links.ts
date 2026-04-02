import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/axios'
import type {
  RegionLinkResponse,
} from '../data/schema'

export function useRegionLink() {
  const query = useQuery({
    queryKey: ['region-link'],
    queryFn: async () => {
      const response = await api.get<RegionLinkResponse>('/region-link')
      console.log('Region link API response:', response.data)
      return response.data.data
    },
    retry: 1,
  })

  return query
}

export function useUpdateRegionLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const response = await api.patch<RegionLinkResponse>(
        '/region-link',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['region-link'] })
      toast.success('Region link image updated successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to update region link'
      toast.error(message || 'Error updating region link')
    },
  })
}
