import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPut } from '@/lib/api-request'
import type { Overview, CompanyInfo } from '../data/schema'

export function useOverviewsList() {
  return useQuery({
    queryKey: ['overview'],
    queryFn: async () => {
      const response = await apiGet('/overview')
      return response.data as Overview
    },
  })
}

export function useUpdateOverview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (overview: Omit<Overview, 'createdAt' | 'updatedAt'>) => {
      const response = await apiPut(`/overview`, overview)
      return response.data as Overview
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overview'] })
    },
  })
}

export function useCompanyInfo() {
  return useQuery({
    queryKey: ['companyInfo'],
    queryFn: async () => {
      const response = await apiGet('/company-info')
      return response.data as CompanyInfo
    },
  })
}

export function useUpdateCompanyInfo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (companyInfo: Omit<CompanyInfo, 'id'>) => {
      const response = await apiPut('/company-info', companyInfo)
      return response.data as CompanyInfo
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyInfo'] })
    },
  })
}
