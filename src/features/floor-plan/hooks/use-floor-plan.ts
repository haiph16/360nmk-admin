import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/axios'
import type {
  FloorPlanApartment,
  FloorPlanApartmentCreateInput,
  FloorPlanBuilding,
  FloorPlanBuildingCreatePayload,
  FloorPlanBuildingCreateResponse,
  FloorPlanBuildingDetailResponse,
  FloorPlanFloor,
  FloorPlanTreeResponse,
} from '../data/schema'

function normalizeTreeData(
  raw: FloorPlanTreeResponse['data']
): FloorPlanBuilding[] {
  if (Array.isArray(raw)) return raw

  if (raw && typeof raw === 'object') {
    // Có pagination: { data: [...], meta: {...} }
    if ('data' in raw && Array.isArray((raw as any).data)) {
      return (raw as any).data
    }
    // Có buildings key
    if ('buildings' in raw && Array.isArray((raw as any).buildings)) {
      return (raw as any).buildings
    }
  }

  return []
}

export function useFloorPlanTree() {
  return useQuery({
    queryKey: ['floor-plan'],
    queryFn: async () => {
      const response = await api.get<FloorPlanTreeResponse>('/floor-plan')
      return normalizeTreeData(response.data.data)
    },
    retry: 1,
  })
}

export function useFloorPlanBuilding(id: number) {
  return useQuery({
    queryKey: ['floor-plan', 'building', id],
    queryFn: async () => {
      const response = await api.get<FloorPlanBuildingDetailResponse>(
        `/floor-plan/buildings/${id}`
      )
      return response.data.data
    },
    enabled: id > 0,
  })
}

/** Step 1: POST building JSON. Step 2: PATCH each floor with image file (parallel). */
export function useCreateFloorPlanBuilding() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      payload: FloorPlanBuildingCreatePayload
      /** Same length as payload.floors — file per floor index (optional) */
      floorImageFiles: (File | undefined)[]
    }) => {
      const { payload, floorImageFiles } = input
      const response = await api.post('/floor-plan/buildings', payload)
      const body = response.data as {
        data?: FloorPlanBuildingCreateResponse
      } & Partial<FloorPlanBuildingCreateResponse>
      const created = (body.data ?? body) as FloorPlanBuildingCreateResponse
      const floors = created.floors ?? []
      const uploads = floors.map((floor, index) => {
        const file = floorImageFiles[index]
        if (!file) return Promise.resolve()
        const formData = new FormData()
        formData.append('file', file)
        return api.patch(`/floor-plan/floors/${floor.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      })
      await Promise.all(uploads)
      return created
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floor-plan'] })
      toast.success('Building created successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to create building'
      toast.error(message || 'Error creating building')
    },
  })
}

export function useUpdateFloorPlanBuilding() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: { name: string }
    }) => {
      const response = await api.patch<{ data: FloorPlanBuilding }>(
        `/floor-plan/buildings/${id}`,
        data
      )
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floor-plan'] })
      toast.success('Building updated successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to update building'
      toast.error(message || 'Error updating building')
    },
  })
}

export function useDeleteFloorPlanBuilding() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/floor-plan/buildings/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floor-plan'] })
      toast.success('Building deleted successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to delete building'
      toast.error(message || 'Error deleting building')
    },
  })
}

export function useCreateFloorPlanFloor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      buildingId: number
      name: string
      svgViewBox?: string
      apartments?: FloorPlanApartmentCreateInput[]
    }) => {
      const response = await api.post<{ data: FloorPlanFloor }>(
        '/floor-plan/floors',
        data
      )
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floor-plan'] })
      toast.success('Floor created successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to create floor'
      toast.error(message || 'Error creating floor')
    },
  })
}

export function useUpdateFloorPlanFloor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      id: number
      /** JSON fields when no file */
      json?: Partial<{
        name: string
        svgViewBox: string | null
      }>
      /** Multipart when uploading floor plan image */
      file?: File
    }) => {
      const { id, json, file } = input
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        if (json?.name != null) formData.append('name', json.name)
        if (json?.svgViewBox != null)
          formData.append('svgViewBox', json.svgViewBox)
        const response = await api.patch<{ data: FloorPlanFloor }>(
          `/floor-plan/floors/${id}`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        )
        return response.data.data
      }
      const response = await api.patch<{ data: FloorPlanFloor }>(
        `/floor-plan/floors/${id}`,
        json ?? {}
      )
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floor-plan'] })
      toast.success('Floor updated successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to update floor'
      toast.error(message || 'Error updating floor')
    },
  })
}

export function useDeleteFloorPlanFloor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/floor-plan/floors/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floor-plan'] })
      toast.success('Floor deleted successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to delete floor'
      toast.error(message || 'Error deleting floor')
    },
  })
}

export function useCreateFloorPlanApartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      floorId: number
      apartmentName: string
      landArea?: string | number
      landDirection?: string
      totalFloorArea?: string | number
      svgData?: string
    }) => {
      const response = await api.post<{ data: FloorPlanApartment }>(
        '/floor-plan/apartments',
        data
      )
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floor-plan'] })
      toast.success('Apartment created successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to create apartment'
      toast.error(message || 'Error creating apartment')
    },
  })
}

export function useUpdateFloorPlanApartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: Partial<{
        apartmentName: string
        landArea: string | number | null
        landDirection: string | null
        totalFloorArea: string | number | null
        svgData: string | null
      }>
    }) => {
      const response = await api.patch<{ data: FloorPlanApartment }>(
        `/floor-plan/apartments/${id}`,
        data
      )
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floor-plan'] })
      toast.success('Apartment updated successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to update apartment'
      toast.error(message || 'Error updating apartment')
    },
  })
}

export function useDeleteFloorPlanApartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/floor-plan/apartments/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floor-plan'] })
      toast.success('Apartment deleted successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to delete apartment'
      toast.error(message || 'Error deleting apartment')
    },
  })
}

export type {
  FloorPlanFloorCreateInput,
  FloorPlanBuildingCreatePayload,
} from '../data/schema'
