export type FloorPlanApartment = {
  id: number
  apartmentName: string
  landArea?: string | number | null
  landDirection?: string | null
  totalFloorArea?: string | number | null
  svgData?: string | null
}

export type FloorPlanFloor = {
  id: number
  name: string
  buildingId?: number
  svgViewBox?: string | null
  img_url?: string | null
  // Legacy support
  image?: string | null
  apartments?: FloorPlanApartment[]
  createdAt?: string
  updatedAt?: string
}

export type FloorPlanBuilding = {
  id: number
  name: string
  floors?: FloorPlanFloor[]
  createdAt?: string
  updatedAt?: string
}

/** Nested payload for POST /floor-plan/buildings */
export type FloorPlanFloorCreateInput = {
  name: string
  svgViewBox?: string
  apartments?: FloorPlanApartmentCreateInput[]
}

export type FloorPlanBuildingCreatePayload = {
  name: string
  floors?: FloorPlanFloorCreateInput[]
}

export type FloorPlanBuildingCreateResponse = {
  id: number
  floors?: Array<{ id: number }>
}
// Trong data/schema.ts
export type FloorPlanApartmentCreateInput = {
  apartmentName: string // đổi từ name
  landArea?: string // đổi từ area
  landDirection?: string // đổi từ direction
  totalFloorArea?: string // thêm mới
  svgData?: string // đổi từ svg
}
export type FloorPlanTreeResponse = {
  success: boolean
  message: string
  data: FloorPlanBuilding[] | { buildings?: FloorPlanBuilding[] }
}

export type FloorPlanBuildingDetailResponse = {
  success: boolean
  message: string
  data: FloorPlanBuilding
}
