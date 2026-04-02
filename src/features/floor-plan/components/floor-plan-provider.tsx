import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type {
  FloorPlanApartment,
  FloorPlanBuilding,
  FloorPlanFloor,
} from '../data/schema'

export type FloorPlanDialogType =
  | 'create-building'
  | 'edit-building'
  | 'delete-building'
  | 'add-floor'
  | 'edit-floor'
  | 'delete-floor'
  | 'add-apartment'
  | 'edit-apartment'
  | 'delete-apartment'

type FloorPlanContextType = {
  open: FloorPlanDialogType | null
  setOpen: (v: FloorPlanDialogType | null) => void
  currentBuilding: FloorPlanBuilding | null
  setCurrentBuilding: React.Dispatch<
    React.SetStateAction<FloorPlanBuilding | null>
  >
  currentFloor: FloorPlanFloor | null
  setCurrentFloor: React.Dispatch<React.SetStateAction<FloorPlanFloor | null>>
  currentApartment: FloorPlanApartment | null
  setCurrentApartment: React.Dispatch<
    React.SetStateAction<FloorPlanApartment | null>
  >
}

const FloorPlanContext = React.createContext<FloorPlanContextType | null>(null)

export function FloorPlanProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<FloorPlanDialogType>(null)
  const [currentBuilding, setCurrentBuilding] =
    useState<FloorPlanBuilding | null>(null)
  const [currentFloor, setCurrentFloor] = useState<FloorPlanFloor | null>(null)
  const [currentApartment, setCurrentApartment] =
    useState<FloorPlanApartment | null>(null)

  return (
    <FloorPlanContext.Provider
      value={{
        open,
        setOpen,
        currentBuilding,
        setCurrentBuilding,
        currentFloor,
        setCurrentFloor,
        currentApartment,
        setCurrentApartment,
      }}
    >
      {children}
    </FloorPlanContext.Provider>
  )
}

export function useFloorPlanContext() {
  const ctx = React.useContext(FloorPlanContext)
  if (!ctx) {
    throw new Error('useFloorPlanContext must be used within FloorPlanProvider')
  }
  return ctx
}
