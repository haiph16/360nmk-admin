import { createContext, useContext, useState } from 'react'

type OtherInterfaceContext = {
  isEditOpen: boolean
  setIsEditOpen: (open: boolean) => void
}

const OtherInfoContextValue = createContext<OtherInterfaceContext | undefined>(
  undefined
)

export function OtherInfoProvider({ children }: { children: React.ReactNode }) {
  const [isEditOpen, setIsEditOpen] = useState(false)

  return (
    <OtherInfoContextValue.Provider value={{ isEditOpen, setIsEditOpen }}>
      {children}
    </OtherInfoContextValue.Provider>
  )
}

export function useOtherInfoContext() {
  const context = useContext(OtherInfoContextValue)
  if (!context) {
    throw new Error('useOtherInfoContext must be used within OtherInfoProvider')
  }
  return context
}
