import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPost, apiPut, apiDelete } from '@/lib/api-request'
import api from '@/lib/axios'
import type { Contact } from '../data/schema'

interface ContactsResponse {
  data: Contact[]
  pagination?: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

export function useContacts(page?: number, pageSize?: number) {
  return useQuery({
    queryKey: ['contacts', page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (page !== undefined) params.append('page', String(page))
      if (pageSize !== undefined) params.append('limit', String(pageSize))
      const response = await api.get<ContactsResponse>(
        `/contacts?${params.toString()}`
      )
      return response.data
    },
  })
}

export function useContactById(id: number) {
  return useQuery({
    queryKey: ['contact', id],
    queryFn: async () => {
      const response = await api.get(`/contacts/${id}`)
      return response.data.data as Contact
    },
    enabled: !!id,
  })
}

export function useCreateContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>
    ) => {
      const response = await apiPost('/contacts', data)
      return response.data as Contact
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useUpdateContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: Partial<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>>
    }) => {
      const response = await apiPut(`/contacts/${id}`, data)
      return response.data as Contact
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useDeleteContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await apiDelete(`/contacts/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}
