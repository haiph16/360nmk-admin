import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import { type User } from '../data/schema'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users')
      return response.data.data as User[]
    },
  })
}
