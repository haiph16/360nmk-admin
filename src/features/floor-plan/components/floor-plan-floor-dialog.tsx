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
import {
  useCreateFloorPlanFloor,
  useUpdateFloorPlanFloor,
} from '../hooks/use-floor-plan'
import { useFloorPlanContext } from './floor-plan-provider'

export function FloorPlanFloorDialog() {
  const { t } = useTranslation()
  const {
    open,
    setOpen,
    currentBuilding,
    currentFloor,
    setCurrentFloor,
  } = useFloorPlanContext()
  const createFloor = useCreateFloorPlanFloor()
  const updateFloor = useUpdateFloorPlanFloor()

  const isAdd = open === 'add-floor'
  const isEdit = open === 'edit-floor'
  const isOpen = isAdd || isEdit

  const [name, setName] = useState('')
  const [svgViewBox, setSvgViewBox] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    if (isEdit && currentFloor) {
      setName(currentFloor.name)
      setSvgViewBox(currentFloor.svgViewBox ?? '')
      setImageFile(null)
    }
    if (isAdd) {
      setName('')
      setSvgViewBox('')
      setImageFile(null)
    }
  }, [isAdd, isEdit, currentFloor, open])

  const onSave = async () => {
    if (!name.trim()) return

    if (isAdd && currentBuilding) {
      await createFloor.mutateAsync({
        buildingId: currentBuilding.id,
        name: name.trim(),
        svgViewBox: svgViewBox.trim() || undefined,
      })
      setOpen(null)
      return
    }

    if (isEdit && currentFloor) {
      if (imageFile) {
        await updateFloor.mutateAsync({
          id: currentFloor.id,
          file: imageFile,
          json: {
            name: name.trim(),
            svgViewBox: svgViewBox.trim() || null,
          },
        })
      } else {
        await updateFloor.mutateAsync({
          id: currentFloor.id,
          json: {
            name: name.trim(),
            svgViewBox: svgViewBox.trim() || null,
          },
        })
      }
      setOpen(null)
      setCurrentFloor(null)
    }
  }

  const pending = createFloor.isPending || updateFloor.isPending

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(null)
          setCurrentFloor(null)
        }
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {isAdd
              ? t('add_floor') || 'Add floor'
              : t('edit_floor') || 'Edit floor'}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-3'>
          <div>
            <Label>{t('name') || 'Name'}</Label>
            <Input
              className='mt-1'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label>svgViewBox</Label>
            <Input
              className='mt-1'
              value={svgViewBox}
              onChange={(e) => setSvgViewBox(e.target.value)}
              placeholder='0 0 100 100'
            />
          </div>
          {isEdit && (
            <div>
              <Label>
                {t('floor_plan_image') || 'Floor plan image'} (
                {t('optional') || 'optional'})
              </Label>
              <Input
                className='mt-1'
                type='file'
                accept='image/*'
                onChange={(e) =>
                  setImageFile(e.target.files?.[0] ?? null)
                }
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(null)}>
            {t('cancel') || 'Cancel'}
          </Button>
          <Button
            onClick={() => void onSave()}
            disabled={pending || !name.trim()}
          >
            {pending ? t('saving') || 'Saving...' : t('save') || 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
