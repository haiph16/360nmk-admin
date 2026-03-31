import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { CompanyInfo } from '../data/schema'
import { useUpdateCompanyInfo } from '../hooks/use-overviews'
import { useOverviewsContext } from './overviews-provider'

interface CompanyInfoEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentCompanyInfo: CompanyInfo | null
}

export function CompanyInfoEditDialog({
  open,
  onOpenChange,
  currentCompanyInfo,
}: CompanyInfoEditDialogProps) {
  const { t } = useTranslation()
  const { setOpen, setCurrentCompanyInfo } = useOverviewsContext()
  const updateCompanyInfo = useUpdateCompanyInfo()

  const [name, setName] = useState(currentCompanyInfo?.name || '')
  const [hotline, setHotline] = useState(currentCompanyInfo?.hotline || '')

  useEffect(() => {
    if (currentCompanyInfo) {
      setName(currentCompanyInfo.name)
      setHotline(currentCompanyInfo.hotline)
    }
  }, [currentCompanyInfo])

  const handleSave = async () => {
    if (!currentCompanyInfo) return

    try {
      await updateCompanyInfo.mutateAsync({
        name,
        hotline,
      })
      onOpenChange(false)
      setOpen(null)
      setCurrentCompanyInfo(null)
    } catch (err) {
      console.error('Update error:', err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {t('edit_company_info') || 'Edit Company Info'}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <label className='mb-2 block text-sm font-medium'>
              {t('company_name') || 'Company Name'}
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('enter_company_name') || 'Enter company name'}
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium'>
              {t('hotline') || 'Hotline'}
            </label>
            <Input
              value={hotline}
              onChange={(e) => setHotline(e.target.value)}
              placeholder={t('enter_hotline') || 'Enter hotline'}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={updateCompanyInfo.isPending}
          >
            {t('cancel') || 'Cancel'}
          </Button>
          <Button onClick={handleSave} disabled={updateCompanyInfo.isPending}>
            {updateCompanyInfo.isPending
              ? `${t('saving') || 'Saving'}...`
              : t('save') || 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
