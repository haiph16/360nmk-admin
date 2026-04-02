import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/axios'
import type {
  ApartmentInterior,
  ApartmentInteriorCreatePayload,
  ApartmentInteriorsResponse,
} from '../data/schema'

export function useApartmentInteriors(
  page?: number,
  pageSize?: number,
  search?: string
) {
  return useQuery({
    queryKey: ['apartment-interiors', page, pageSize, search],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (page !== undefined) params.append('page', String(page))
      if (pageSize !== undefined) params.append('limit', String(pageSize))
      if (search) params.append('search', search)

      const response = await api.get<ApartmentInteriorsResponse>(
        `/apartment-interior?${params.toString()}`
      )
      return response.data
    },
    retry: 1,
  })
}

export function useApartmentInterior(id: number) {
  return useQuery({
    queryKey: ['apartment-interiors', id],
    queryFn: async () => {
      const response = await api.get<{ data: ApartmentInterior }>(
        `/apartment-interior/${id}`
      )
      return response.data.data
    },
    enabled: id > 0,
  })
}

export function useCreateApartmentInterior() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ApartmentInteriorCreatePayload) => {
      const response = await api.post<{ data: ApartmentInterior }>(
        '/apartment-interior',
        data
      )
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apartment-interiors'] })
      toast.success('Apartment interior created successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to create apartment interior'
      toast.error(message || 'Error creating apartment interior')
    },
  })
}

export function useUpdateApartmentInterior() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: Partial<ApartmentInteriorCreatePayload>
    }) => {
      const response = await api.patch<{ data: ApartmentInterior }>(
        `/apartment-interior/${id}`,
        data
      )
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apartment-interiors'] })
      toast.success('Apartment interior updated successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to update apartment interior'
      toast.error(message || 'Error updating apartment interior')
    },
  })
}

export function useDeleteApartmentInterior() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/apartment-interior/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apartment-interiors'] })
      toast.success('Apartment interior deleted successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to delete apartment interior'
      toast.error(message || 'Error deleting apartment interior')
    },
  })
}
