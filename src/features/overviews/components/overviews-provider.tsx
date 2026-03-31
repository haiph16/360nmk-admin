import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { Overview, CompanyInfo } from '../data/schema'

type OverviewsDialogType = 'edit' | 'edit-company' | 'view'

type OverviewsContextType = {
  open: OverviewsDialogType | null
  setOpen: (str: OverviewsDialogType | null) => void
  currentOverview: Overview | null
  setCurrentOverview: React.Dispatch<React.SetStateAction<Overview | null>>
  currentCompanyInfo: CompanyInfo | null
  setCurrentCompanyInfo: React.Dispatch<
    React.SetStateAction<CompanyInfo | null>
  >
}

const OverviewsContext = React.createContext<OverviewsContextType | null>(null)

export function OverviewsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<OverviewsDialogType>(null)
  const [currentOverview, setCurrentOverview] = useState<Overview | null>(null)
  const [currentCompanyInfo, setCurrentCompanyInfo] =
    useState<CompanyInfo | null>(null)

  return (
    <OverviewsContext.Provider
      value={{
        open,
        setOpen,
        currentOverview,
        setCurrentOverview,
        currentCompanyInfo,
        setCurrentCompanyInfo,
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
