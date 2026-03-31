import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { Product } from '../data/schema'

type ProductsDialogType = 'add' | 'edit' | 'delete'

type ProductsContextType = {
  open: ProductsDialogType | null
  setOpen: (str: ProductsDialogType | null) => void
  currentRow: Product | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Product | null>>
}

const ProductsContext = React.createContext<ProductsContextType | undefined>(
  undefined
)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ProductsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Product | null>(null)

  return (
    <ProductsContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export const useProductsContext = () => {
  const context = React.useContext(ProductsContext)
  if (!context) {
    throw new Error(
      'useProductsContext has to be used within <ProductsProvider>'
    )
  }
  return context
}
