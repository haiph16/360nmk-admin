import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { VirtualScene } from '../data/schema'

type VirtualScenesDialogType = 'add' | 'edit' | 'delete'

type VirtualScenesContextType = {
  open: VirtualScenesDialogType | null
  setOpen: (str: VirtualScenesDialogType | null) => void
  currentRow: VirtualScene | null
  setCurrentRow: React.Dispatch<React.SetStateAction<VirtualScene | null>>
}

const VirtualScenesContext =
  React.createContext<VirtualScenesContextType | null>(null)

export function VirtualScenesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<VirtualScenesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<VirtualScene | null>(null)

  return (
    <VirtualScenesContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </VirtualScenesContext.Provider>
  )
}

export const useVirtualScenesContext = () => {
  const context = React.useContext(VirtualScenesContext)
  if (!context) {
    throw new Error(
      'useVirtualScenesContext has to be used within <VirtualScenesProvider>'
    )
  }
  return context
}
