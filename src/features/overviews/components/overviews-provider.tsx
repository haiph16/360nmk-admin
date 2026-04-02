import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { Overview } from '../data/schema'

type OverviewsDialogType = 'edit' | 'view'

type OverviewsContextType = {
  open: OverviewsDialogType | null
  setOpen: (str: OverviewsDialogType | null) => void
  currentOverview: Overview | null
  setCurrentOverview: React.Dispatch<React.SetStateAction<Overview | null>>
}

const OverviewsContext = React.createContext<OverviewsContextType | null>(null)

export function OverviewsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<OverviewsDialogType>(null)
  const [currentOverview, setCurrentOverview] = useState<Overview | null>(null)

  return (
    <OverviewsContext.Provider
      value={{
        open,
        setOpen,
        currentOverview,
        setCurrentOverview,
      }}
    >
      {children}
    </OverviewsContext.Provider>
  )
}

export const useOverviewsContext = () => {
  const context = React.useContext(OverviewsContext)
  if (!context) {
    throw new Error(
      'useOverviewsContext has to be used within <OverviewsProvider>'
    )
  }
  return context
}
