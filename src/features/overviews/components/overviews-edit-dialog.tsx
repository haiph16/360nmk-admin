import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { Overview } from '../data/schema'
import { useUpdateOverview } from '../hooks/use-overviews'
import { useOverviewsContext } from './overviews-provider'

interface OverviewsEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentOverview: Overview | null
}

export function OverviewsEditDialog({
  open,
  onOpenChange,
  currentOverview,
}: OverviewsEditDialogProps) {
  const { t } = useTranslation()
  const { setOpen, setCurrentOverview } = useOverviewsContext()
  const updateOverview = useUpdateOverview()

  const [link360, setLink360] = useState(currentOverview?.link_360 || '')

  const handleSave = async () => {
    try {
      await updateOverview.mutateAsync({
        link_360: link360 || null,
      })
      toast.success(t('save_success') || 'Saved successfully')
      onOpenChange(false)
      setOpen(null)
      setCurrentOverview(null)
    } catch (err) {
      toast.error(t('save_error') || 'Error occurred')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>{t('edit') || 'Edit'} Overview</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <label className='mb-2 block text-sm font-medium'>
              {t('link_360') || '360° Link'}
            </label>
            <Input
              value={link360}
              onChange={(e) => setLink360(e.target.value)}
              placeholder='https://example.com/360'
              type='url'
            />
            <p className='mt-1 text-xs text-muted-foreground'>
              {t('enter_360_link') || 'Enter the URL to the 360° content'}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={updateOverview.isPending}
          >
            {t('cancel') || 'Cancel'}
          </Button>
          <Button onClick={handleSave} disabled={updateOverview.isPending}>
            {updateOverview.isPending
              ? `${t('saving') || 'Saving'}...`
              : t('save') || 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
