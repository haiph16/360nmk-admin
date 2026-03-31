import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiPost, apiPatch, apiDelete } from '@/lib/api-request'
import api from '@/lib/axios'

export interface Role {
  id: string
  name: string
  description: string | null
  permissions?: { id: string; slug: string; name: string }[]
  createdAt: string
  updatedAt: string
}

export function useRoles() {
  const queryClient = useQueryClient()

  const rolesQuery = useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await api.get('/roles')
      return response.data.data
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: Partial<Role>) => apiPost('/roles', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Role created successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to create role'
      toast.error(message || 'Failed to create role')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<Role> & { id: string }) =>
      apiPatch(`/roles/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Role updated successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to update role'
      toast.error(message || 'Failed to update role')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/roles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Role deleted successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to delete role'
      toast.error(message || 'Failed to delete role')
    },
  })

  const assignPermissionsMutation = useMutation({
    mutationFn: ({
      roleId,
      permissionIds,
    }: {
      roleId: string
      permissionIds: string[]
    }) => apiPost(`/roles/${roleId}/permissions`, { permissionIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Permissions assigned successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to assign permissions'
      toast.error(message || 'Failed to assign permissions')
    },
  })

  return {
    ...rolesQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    assignPermissionsMutation,
  }
}
