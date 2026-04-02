import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useUtilityPremisesContext } from './utility-premises-provider'

export function UtilityPremisesPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen, setParentId } = useUtilityPremisesContext()

  const handleCreate = () => {
    setParentId(null)
    setOpen('create')
  }

  return (
    <Button onClick={handleCreate} size='sm'>
      <Plus className='mr-2 h-4 w-4' />
      {t('add_premise') || 'Add Premise'}
    </Button>
  )
}
