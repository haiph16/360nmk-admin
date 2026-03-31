import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useManagementContentsContext } from './management-contents-provider'

export function ManagementContentsPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useManagementContentsContext()

  return (
    <Button onClick={() => setOpen('add')} size='sm'>
      + {t('add_management_content') || 'Add Management Content'}
    </Button>
  )
}
