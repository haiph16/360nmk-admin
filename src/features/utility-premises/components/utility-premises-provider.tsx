import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { UtilityPremise } from '../data/schema'

type UtilityPremisesDialogType = 'create' | 'edit' | 'delete'

type UtilityPremisesContextType = {
  open: UtilityPremisesDialogType | null
  setOpen: (str: UtilityPremisesDialogType | null) => void
  currentPremise: UtilityPremise | null
  setCurrentPremise: React.Dispatch<React.SetStateAction<UtilityPremise | null>>
  parentId: number | null
  setParentId: React.Dispatch<React.SetStateAction<number | null>>
}

const UtilityPremisesContext =
  React.createContext<UtilityPremisesContextType | null>(null)

export function UtilityPremisesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<UtilityPremisesDialogType>(null)
  const [currentPremise, setCurrentPremise] = useState<UtilityPremise | null>(
    null
  )
  const [parentId, setParentId] = useState<number | null>(null)

  return (
    <UtilityPremisesContext.Provider
      value={{
        open,
        setOpen,
        currentPremise,
        setCurrentPremise,
        parentId,
        setParentId,
      }}
    >
      {children}
    </UtilityPremisesContext.Provider>
  )
}

export const useUtilityPremisesContext = () => {
  const context = React.useContext(UtilityPremisesContext)
  if (!context) {
    throw new Error(
      'useUtilityPremisesContext has to be used within <UtilityPremisesProvider>'
    )
  }
  return context
}
