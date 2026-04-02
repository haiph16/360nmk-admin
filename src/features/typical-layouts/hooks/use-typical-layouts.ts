import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/axios'
import type { TypicalLayout, TypicalLayoutsResponse } from '../data/schema'

export function useTypicalLayouts(page?: number, pageSize?: number) {
  return useQuery({
    queryKey: ['typical-layouts', page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (page !== undefined) params.append('page', String(page))
      if (pageSize !== undefined) params.append('limit', String(pageSize))

      const response = await api.get<TypicalLayoutsResponse>(
        `/typical-layouts?${params.toString()}`
      )
      return response.data
    },
    retry: 1,
  })
}

export function useTypicalLayout(id: number) {
  return useQuery({
    queryKey: ['typical-layouts', id],
    queryFn: async () => {
      const response = await api.get<{ data: TypicalLayout }>(
        `/typical-layouts/${id}`
      )
      return response.data.data
    },
    enabled: id > 0,
  })
}

export function useCreateTypicalLayout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.post<{ data: TypicalLayout }>(
        '/typical-layouts',
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['typical-layouts'] })
      toast.success('Typical layout created successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to create typical layout'
      toast.error(message || 'Error creating typical layout')
    },
  })
}

export function useUpdateTypicalLayout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await api.patch<{ data: TypicalLayout }>(
        `/typical-layouts/${id}`,
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['typical-layouts'] })
      toast.success('Typical layout updated successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to update typical layout'
      toast.error(message || 'Error updating typical layout')
    },
  })
}

export function useDeleteTypicalLayout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      id: number
      name?: string
      original?: string | null
      large?: string | null
      medium?: string | null
      thumbnail?: string | null
    }) => {
      const { id, ...data } = input
      await api.delete(`/typical-layouts/${id}`, {
        data: Object.keys(data).length ? data : undefined,
      })
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['typical-layouts'] })
      toast.success('Typical layout deleted successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to delete typical layout'
      toast.error(message || 'Error deleting typical layout')
    },
  })
}
