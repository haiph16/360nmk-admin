import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { usePermissionsContext } from './permissions-provider'

export function PermissionsPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow } = usePermissionsContext()
  return (
    <div className='flex gap-2'>
      <Button
        onClick={() => {
          setCurrentRow(null)
          setOpen('add')
        }}
      >
        <Plus size={18} className='mr-2' /> {t('add_permission')}
      </Button>
    </div>
  )
}
