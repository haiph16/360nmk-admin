import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/axios'
import type {
  UtilityMedia,
  UtilityMediaCreatePayload,
  UtilityMediaResponse,
} from '../data/schema'

export function useUtilityMedias(utilityPremiseId: number) {
  return useQuery({
    queryKey: ['utility-medias', utilityPremiseId],
    queryFn: async () => {
      const response = await api.get<UtilityMediaResponse>(
        `/utility-premises/${utilityPremiseId}/medias`
      )
      return response.data.data
    },
    enabled: utilityPremiseId > 0,
  })
}

export function useCreateUtilityMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UtilityMediaCreatePayload) => {
      const response = await api.post<{ data: UtilityMedia }>(
        '/utility-medias',
        data
      )
      return response.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['utility-medias', variables.utilityPremiseId],
      })
      toast.success('Utility media created successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to create utility media'
      toast.error(message || 'Error creating utility media')
    },
  })
}

export function useUpdateUtilityMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: Partial<UtilityMediaCreatePayload>
    }) => {
      const response = await api.patch<{ data: UtilityMedia }>(
        `/utility-medias/${id}`,
        data
      )
      return response.data.data
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ['utility-medias', result.utilityPremiseId],
      })
      toast.success('Utility media updated successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to update utility media'
      toast.error(message || 'Error updating utility media')
    },
  })
}

export function useDeleteUtilityMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/utility-medias/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utility-medias'] })
      toast.success('Utility media deleted successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to delete utility media'
      toast.error(message || 'Error deleting utility media')
    },
  })
}
