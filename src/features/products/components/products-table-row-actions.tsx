import { Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { Product } from '../data/schema'
import { useProductsContext } from './products-provider'

interface ProductsTableRowActionsProps {
  row: Row<Product>
}

export function ProductsTableRowActions({ row }: ProductsTableRowActionsProps) {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow } = useProductsContext()

  return (
    <div className='flex gap-2'>
      <button
        onClick={() => {
          setCurrentRow(row.original)
          setOpen('edit')
        }}
        className='text-blue-600 hover:underline'
      >
        {t('edit')}
      </button>
      <button
        onClick={() => {
          setCurrentRow(row.original)
          setOpen('delete')
        }}
        className='text-red-600 hover:underline'
      >
        {t('delete')}
      </button>
    </div>
  )
}
