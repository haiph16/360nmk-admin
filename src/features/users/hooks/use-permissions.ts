import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiPost, apiPatch, apiDelete } from '@/lib/api-request'
import api from '@/lib/axios'

export interface Permission {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export function usePermissions() {
  const queryClient = useQueryClient()

  const permissionsQuery = useQuery<Permission[]>({
    queryKey: ['permissions'],
    queryFn: async () => {
      const response = await api.get('/permissions')
      return response.data.data
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: Partial<Permission>) => apiPost('/permissions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      toast.success('Permission created successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to create permission'
      toast.error(message || 'Failed to create permission')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<Permission> & { id: string }) =>
      apiPatch(`/permissions/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      toast.success('Permission updated successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to update permission'
      toast.error(message || 'Failed to update permission')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/permissions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      toast.success('Permission deleted successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to delete permission'
      toast.error(message || 'Failed to delete permission')
    },
  })

  return {
    ...permissionsQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
