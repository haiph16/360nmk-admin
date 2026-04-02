import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { RegionLink } from '../data/schema'

type RegionLinksDialogType = 'edit' | 'view'

type RegionLinksContextType = {
  open: RegionLinksDialogType | null
  setOpen: (str: RegionLinksDialogType | null) => void
  currentRegionLink: RegionLink | null
  setCurrentRegionLink: React.Dispatch<React.SetStateAction<RegionLink | null>>
}

const RegionLinksContext = React.createContext<RegionLinksContextType | null>(
  null
)

export function RegionLinksProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RegionLinksDialogType>(null)
  const [currentRegionLink, setCurrentRegionLink] = useState<RegionLink | null>(
    null
  )

  return (
    <RegionLinksContext.Provider
      value={{
        open,
        setOpen,
        currentRegionLink,
        setCurrentRegionLink,
      }}
    >
      {children}
    </RegionLinksContext.Provider>
  )
}

export const useRegionLinksContext = () => {
  const context = React.useContext(RegionLinksContext)
  if (!context) {
    throw new Error(
      'useRegionLinksContext has to be used within <RegionLinksProvider>'
    )
  }
  return context
}
