import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPost, apiPut, apiDelete } from '@/lib/api-request'
import api from '@/lib/axios'
import type { Location } from '../data/schema'

interface LocationsResponse {
  data: Location[]
  pagination?: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

export function useLocations(page?: number, pageSize?: number) {
  return useQuery({
    queryKey: ['locations', page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (page !== undefined) params.append('page', String(page))
      if (pageSize !== undefined) params.append('limit', String(pageSize))
      const response = await api.get<LocationsResponse>(
        `/locations?${params.toString()}`
      )
      return response.data
    },
  })
}

export function useLocationById(id: number) {
  return useQuery({
    queryKey: ['location', id],
    queryFn: async () => {
      const response = await api.get(`/locations/${id}`)
      return response.data.data as Location
    },
    enabled: !!id,
  })
}

export function useCreateLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      data: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>
    ) => {
      const response = await apiPost('/locations', data)
      return response.data as Location
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
    },
  })
}

export function useUpdateLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: Partial<Omit<Location, 'id' | 'createdAt' | 'updatedAt'>>
    }) => {
      const response = await apiPut(`/locations/${id}`, data)
      return response.data as Location
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
    },
  })
}

export function useDeleteLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await apiDelete(`/locations/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
    },
  })
}
