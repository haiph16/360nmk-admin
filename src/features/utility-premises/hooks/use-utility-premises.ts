import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/axios'
import type {
  UtilityPremise,
  UtilityPremiseCreatePayload,
  UtilityPremiseListResponse,
} from '../data/schema'

export function useUtilityPremises(
  page?: number,
  pageSize?: number,
  search?: string
) {
  return useQuery({
    queryKey: ['utility-premises', page, pageSize, search],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (page !== undefined) params.append('page', String(page))
      if (pageSize !== undefined) params.append('limit', String(pageSize))
      if (search) params.append('search', search)

      const response = await api.get<UtilityPremiseListResponse>(
        `/utility-premises?${params.toString()}`
      )
      return response.data
    },
    retry: 1,
  })
}

export function useAllUtilityPremises() {
  return useQuery({
    queryKey: ['utility-premises-all'],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('limit', '1000')

      const response = await api.get<UtilityPremiseListResponse>(
        `/utility-premises?${params.toString()}`
      )
      return response.data.data?.data || []
    },
    retry: 1,
  })
}

type UtilityPremiseParent = {
  id: number
  name: string
}

export function useUtilityPremisesParents() {
  return useQuery({
    queryKey: ['utility-premises-parents'],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean
        message: string
        data: UtilityPremiseParent[]
      }>('/utility-premises/parents')
      return response.data.data
    },
    retry: 1,
  })
}

export function useUtilityPremise(id: number) {
  return useQuery({
    queryKey: ['utility-premises', id],
    queryFn: async () => {
      const response = await api.get<{ data: UtilityPremise }>(
        `/utility-premises/${id}`
      )
      return response.data.data
    },
    enabled: id > 0,
  })
}

export function useCreateUtilityPremise() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UtilityPremiseCreatePayload) => {
      const response = await api.post<{ data: UtilityPremise }>(
        '/utility-premises',
        data,
        {
          withCredentials: true,
        }
      )
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utility-premises'] })
      toast.success('Utility premise created successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to create utility premise'
      toast.error(message || 'Error creating utility premise')
    },
  })
}

export function useUpdateUtilityPremise() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: Partial<UtilityPremiseCreatePayload>
    }) => {
      const response = await api.patch<{ data: UtilityPremise }>(
        `/utility-premises/${id}`,
        data
      )
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utility-premises'] })
      toast.success('Utility premise updated successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to update utility premise'
      toast.error(message || 'Error updating utility premise')
    },
  })
}

export function useDeleteUtilityPremise() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/utility-premises/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utility-premises'] })
      toast.success('Utility premise deleted successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to delete utility premise'
      toast.error(message || 'Error deleting utility premise')
    },
  })
}
