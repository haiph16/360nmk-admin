import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { TypicalLayout } from '../data/schema'

type TypicalLayoutsDialogType = 'add' | 'edit' | 'delete'

type TypicalLayoutsContextType = {
  open: TypicalLayoutsDialogType | null
  setOpen: (str: TypicalLayoutsDialogType | null) => void
  currentRow: TypicalLayout | null
  setCurrentRow: React.Dispatch<React.SetStateAction<TypicalLayout | null>>
}

const TypicalLayoutsContext =
  React.createContext<TypicalLayoutsContextType | null>(null)

export function TypicalLayoutsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<TypicalLayoutsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<TypicalLayout | null>(null)

  return (
    <TypicalLayoutsContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </TypicalLayoutsContext.Provider>
  )
}

export const useTypicalLayoutsContext = () => {
  const context = React.useContext(TypicalLayoutsContext)
  if (!context) {
    throw new Error(
      'useTypicalLayoutsContext has to be used within <TypicalLayoutsProvider>'
    )
  }
  return context
}

