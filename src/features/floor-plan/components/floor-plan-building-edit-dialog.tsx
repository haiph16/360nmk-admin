import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdateFloorPlanBuilding } from '../hooks/use-floor-plan'
import { useFloorPlanContext } from './floor-plan-provider'

export function FloorPlanBuildingEditDialog() {
  const { t } = useTranslation()
  const { open, setOpen, currentBuilding, setCurrentBuilding } =
    useFloorPlanContext()
  const updateBuilding = useUpdateFloorPlanBuilding()
  const [name, setName] = useState('')

  useEffect(() => {
    if (open === 'edit-building' && currentBuilding) {
      setName(currentBuilding.name)
    }
  }, [open, currentBuilding])

  const isOpen = open === 'edit-building'

  const onSave = async () => {
    if (!currentBuilding || !name.trim()) return
    await updateBuilding.mutateAsync({
      id: currentBuilding.id,
      data: { name: name.trim() },
    })
    setOpen(null)
    setCurrentBuilding(null)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(null)
          setCurrentBuilding(null)
        }
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {t('edit_building') || 'Edit building'}
          </DialogTitle>
        </DialogHeader>
        <div>
          <Label>{t('name') || 'Name'}</Label>
          <Input
            className='mt-1'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(null)}>
            {t('cancel') || 'Cancel'}
          </Button>
          <Button
            onClick={() => void onSave()}
            disabled={updateBuilding.isPending || !name.trim()}
          >
            {t('save') || 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
