import { createContext, useContext, useState } from 'react'
import type { ApartmentInterior } from '../data/schema'

type DialogType = 'add' | 'edit' | 'delete' | null

interface ApartmentInteriorsContextType {
  open: DialogType
  setOpen: (type: DialogType) => void
  currentRow: ApartmentInterior | null
  setCurrentRow: (row: ApartmentInterior | null) => void
}

const ApartmentInteriorsContext = createContext<
  ApartmentInteriorsContextType | undefined
>(undefined)

export function ApartmentInteriorsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<ApartmentInterior | null>(null)

  return (
    <ApartmentInteriorsContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </ApartmentInteriorsContext.Provider>
  )
}

export function useApartmentInteriorsContext() {
  const context = useContext(ApartmentInteriorsContext)
  if (!context) {
    throw new Error(
      'useApartmentInteriorsContext must be used within ApartmentInteriorsProvider'
    )
  }
  return context
}
