import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { View } from '../data/schema'

type ViewsDialogType = 'add' | 'edit' | 'delete'

type ViewsContextType = {
  open: ViewsDialogType | null
  setOpen: (str: ViewsDialogType | null) => void
  currentRow: View | null
  setCurrentRow: React.Dispatch<React.SetStateAction<View | null>>
}

const ViewsContext = React.createContext<ViewsContextType | null>(null)

export function ViewsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ViewsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<View | null>(null)

  return (
    <ViewsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ViewsContext.Provider>
  )
}

export const useViewsContext = () => {
  const context = React.useContext(ViewsContext)
  if (!context) {
    throw new Error('useViewsContext has to be used within <ViewsProvider>')
  }
  return context
}
