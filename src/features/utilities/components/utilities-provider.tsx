import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { Utility } from '../data/schema'

type UtilitiesDialogType = 'add' | 'edit' | 'delete'

type UtilitiesContextType = {
  open: UtilitiesDialogType | null
  setOpen: (str: UtilitiesDialogType | null) => void
  currentRow: Utility | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Utility | null>>
}

const UtilitiesContext = React.createContext<UtilitiesContextType | undefined>(
  undefined
)

export function UtilitiesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<UtilitiesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Utility | null>(null)

  return (
    <UtilitiesContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </UtilitiesContext.Provider>
  )
}

export const useUtilitiesContext = () => {
  const context = React.useContext(UtilitiesContext)
  if (!context) {
    throw new Error(
      'useUtilitiesContext has to be used within <UtilitiesProvider>'
    )
  }
  return context
}
