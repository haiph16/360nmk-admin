import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { ManagementContent } from '../data/schema'

type ManagementContentsDialogType = 'add' | 'edit' | 'delete'

type ManagementContentsContextType = {
  open: ManagementContentsDialogType | null
  setOpen: (str: ManagementContentsDialogType | null) => void
  currentRow: ManagementContent | null
  setCurrentRow: React.Dispatch<React.SetStateAction<ManagementContent | null>>
}

const ManagementContentsContext =
  React.createContext<ManagementContentsContextType | null>(null)

export function ManagementContentsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<ManagementContentsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<ManagementContent | null>(null)

  return (
    <ManagementContentsContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </ManagementContentsContext.Provider>
  )
}

export const useManagementContentsContext = () => {
  const context = React.useContext(ManagementContentsContext)
  if (!context) {
    throw new Error(
      'useManagementContentsContext has to be used within <ManagementContentsProvider>'
    )
  }
  return context
}
