import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { Location } from '../data/schema'

type LocationsDialogType = 'add' | 'edit' | 'delete'

type LocationsContextType = {
  open: LocationsDialogType | null
  setOpen: (str: LocationsDialogType | null) => void
  currentRow: Location | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Location | null>>
}

const LocationsContext = React.createContext<LocationsContextType | null>(null)

export function LocationsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<LocationsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Location | null>(null)

  return (
    <LocationsContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </LocationsContext.Provider>
  )
}

export const useLocationsContext = () => {
  const context = React.useContext(LocationsContext)
  if (!context) {
    throw new Error(
      'useLocationsContext has to be used within <LocationsProvider>'
    )
  }
  return context
}
