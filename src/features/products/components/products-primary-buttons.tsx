import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useProductsContext } from './products-provider'

export function ProductsPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow } = useProductsContext()

  const handleAdd = () => {
    setCurrentRow(null)
    setOpen('add')
  }

  return (
    <Button onClick={handleAdd} size='sm' className='gap-2'>
      <Plus className='h-4 w-4' />
      {t('add_product') || 'Add Product'}
    </Button>
  )
}
