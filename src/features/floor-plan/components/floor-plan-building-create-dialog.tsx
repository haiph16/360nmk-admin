import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import type { FloorPlanBuildingCreatePayload } from '../data/schema'
import { useCreateFloorPlanBuilding } from '../hooks/use-floor-plan'
import { useFloorPlanContext } from './floor-plan-provider'

// Sửa type AptDraft
type AptDraft = {
  apartmentName: string
  landArea: string
  landDirection: string
  totalFloorArea: string
  svgData: string
}

// Sửa emptyApt
const emptyApt = (): AptDraft => ({
  apartmentName: '',
  landArea: '',
  landDirection: '',
  totalFloorArea: '',
  svgData: '',
})
type FloorDraft = {
  name: string
  svgViewBox: string
  imageFile: File | null
  apartments: AptDraft[]
}

const emptyFloor = (): FloorDraft => ({
  name: '',
  svgViewBox: '',
  imageFile: null,
  apartments: [emptyApt()],
})

export function FloorPlanBuildingCreateDialog() {
  const { t } = useTranslation()
  const { open, setOpen } = useFloorPlanContext()
  const createBuilding = useCreateFloorPlanBuilding()

  const [buildingName, setBuildingName] = useState('')
  const [floors, setFloors] = useState<FloorDraft[]>([emptyFloor()])

  const reset = () => {
    setBuildingName('')
    setFloors([emptyFloor()])
  }

  const isOpen = open === 'create-building'

  const handleClose = (v: boolean) => {
    if (!v) {
      setOpen(null)
      reset()
    }
  }

  const onSubmit = async () => {
    if (!buildingName.trim()) return

    const payload: FloorPlanBuildingCreatePayload = {
      name: buildingName.trim(),
      floors: floors
        .filter((f) => f.name.trim())
        .map((f) => ({
          name: f.name.trim(),
          svgViewBox: f.svgViewBox.trim() || undefined,
          apartments: f.apartments
            .filter((a) => a.apartmentName.trim())
            .map((a) => ({
              apartmentName: a.apartmentName.trim(),
              landArea: a.landArea.trim() || undefined,
              landDirection: a.landDirection.trim() || undefined,
              totalFloorArea: a.totalFloorArea.trim() || undefined,
              svgData: a.svgData.trim() || undefined,
            })),
        })),
    }

    const floorImageFiles = floors
      .filter((f) => f.name.trim())
      .map((f) => f.imageFile ?? undefined)

    await createBuilding.mutateAsync({ payload, floorImageFiles })
    setOpen(null)
    reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='flex max-h-[90vh] max-w-2xl flex-col gap-0 p-0'>
        <DialogHeader className='shrink-0 border-b px-6 py-4'>
          <DialogTitle>{t('create_building') || 'Create building'}</DialogTitle>
        </DialogHeader>
        <ScrollArea className='max-h-[min(70vh,560px)] px-6 py-4'>
          <div className='space-y-4 pe-2'>
            <div>
              <Label>{t('name') || 'Name'}</Label>
              <Input
                className='mt-1'
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
                placeholder={t('building_name') || 'Building name'}
              />
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>
                {t('floors') || 'Floors'}
              </span>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setFloors((prev) => [...prev, emptyFloor()])}
              >
                <Plus className='me-1 h-4 w-4' />
                {t('add_floor') || 'Add floor'}
              </Button>
            </div>

            {floors.map((floor, fi) => (
              <div
                key={fi}
                className='space-y-3 rounded-lg border bg-muted/30 p-4'
              >
                <div className='flex items-start justify-between gap-2'>
                  <span className='text-xs font-medium text-muted-foreground'>
                    {t('floor') || 'Floor'} #{fi + 1}
                  </span>
                  {floors.length > 1 && (
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 shrink-0 text-destructive'
                      onClick={() =>
                        setFloors((prev) => prev.filter((_, i) => i !== fi))
                      }
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  )}
                </div>
                <div className='grid gap-3 sm:grid-cols-2'>
                  <div>
                    <Label className='text-xs'>{t('name') || 'Name'} *</Label>
                    <Input
                      className='mt-1'
                      value={floor.name}
                      onChange={(e) =>
                        setFloors((prev) =>
                          prev.map((f, i) =>
                            i === fi ? { ...f, name: e.target.value } : f
                          )
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label className='text-xs'>svgViewBox</Label>
                    <Input
                      className='mt-1'
                      value={floor.svgViewBox}
                      onChange={(e) =>
                        setFloors((prev) =>
                          prev.map((f, i) =>
                            i === fi ? { ...f, svgViewBox: e.target.value } : f
                          )
                        )
                      }
                      placeholder='0 0 100 100'
                    />
                  </div>
                </div>
                <div>
                  <Label className='text-xs'>
                    {t('floor_plan_image') || 'Floor plan image'}
                  </Label>
                  <Input
                    className='mt-1'
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null
                      setFloors((prev) =>
                        prev.map((f, i) =>
                          i === fi ? { ...f, imageFile: file } : f
                        )
                      )
                    }}
                  />
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-xs'>
                      {t('apartments') || 'Apartments'}
                    </Label>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() =>
                        setFloors((prev) =>
                          prev.map((f, i) =>
                            i === fi
                              ? {
                                  ...f,
                                  apartments: [...f.apartments, emptyApt()],
                                }
                              : f
                          )
                        )
                      }
                    >
                      <Plus className='me-1 h-3 w-3' />
                      {t('add') || 'Add'}
                    </Button>
                  </div>
                  {floor.apartments.map((apt, ai) => (
                    <div
                      key={ai}
                      className='grid gap-2 rounded border bg-background p-2 sm:grid-cols-2'
                    >
                      <Input
                        placeholder={t('apartment_name') || 'Apartment name'}
                        value={apt.apartmentName}
                        onChange={(e) =>
                          setFloors((prev) =>
                            prev.map((f, i) =>
                              i === fi
                                ? {
                                    ...f,
                                    apartments: f.apartments.map((a, j) =>
                                      j === ai
                                        ? {
                                            ...a,
                                            apartmentName: e.target.value,
                                          }
                                        : a
                                    ),
                                  }
                                : f
                            )
                          )
                        }
                      />
                      <Input
                        placeholder={
                          t('land_area') || 'Land area (e.g. 120 m²)'
                        }
                        value={apt.landArea}
                        onChange={(e) =>
                          setFloors((prev) =>
                            prev.map((f, i) =>
                              i === fi
                                ? {
                                    ...f,
                                    apartments: f.apartments.map((a, j) =>
                                      j === ai
                                        ? { ...a, landArea: e.target.value }
                                        : a
                                    ),
                                  }
                                : f
                            )
                          )
                        }
                      />
                      <Input
                        placeholder={
                          t('land_direction') || 'Direction (e.g. Đông Nam)'
                        }
                        value={apt.landDirection}
                        onChange={(e) =>
                          setFloors((prev) =>
                            prev.map((f, i) =>
                              i === fi
                                ? {
                                    ...f,
                                    apartments: f.apartments.map((a, j) =>
                                      j === ai
                                        ? {
                                            ...a,
                                            landDirection: e.target.value,
                                          }
                                        : a
                                    ),
                                  }
                                : f
                            )
                          )
                        }
                      />
                      <Input
                        placeholder={
                          t('total_floor_area') ||
                          'Total floor area (e.g. 332.03 m²)'
                        }
                        value={apt.totalFloorArea}
                        onChange={(e) =>
                          setFloors((prev) =>
                            prev.map((f, i) =>
                              i === fi
                                ? {
                                    ...f,
                                    apartments: f.apartments.map((a, j) =>
                                      j === ai
                                        ? {
                                            ...a,
                                            totalFloorArea: e.target.value,
                                          }
                                        : a
                                    ),
                                  }
                                : f
                            )
                          )
                        }
                      />
                      <div className='flex gap-1 sm:col-span-2'>
                        <Input
                          className='flex-1'
                          placeholder='SVG Data'
                          value={apt.svgData}
                          onChange={(e) =>
                            setFloors((prev) =>
                              prev.map((f, i) =>
                                i === fi
                                  ? {
                                      ...f,
                                      apartments: f.apartments.map((a, j) =>
                                        j === ai
                                          ? { ...a, svgData: e.target.value }
                                          : a
                                      ),
                                    }
                                  : f
                              )
                            )
                          }
                        />
                        {floor.apartments.length > 1 && (
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='shrink-0 text-destructive'
                            onClick={() =>
                              setFloors((prev) =>
                                prev.map((f, i) =>
                                  i === fi
                                    ? {
                                        ...f,
                                        apartments: f.apartments.filter(
                                          (_, j) => j !== ai
                                        ),
                                      }
                                    : f
                                )
                              )
                            }
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter className='shrink-0 border-t px-6 py-4'>
          <Button variant='outline' onClick={() => handleClose(false)}>
            {t('cancel') || 'Cancel'}
          </Button>
          <Button
            onClick={() => void onSubmit()}
            disabled={
              createBuilding.isPending ||
              !buildingName.trim() ||
              !floors.some((f) => f.name.trim())
            }
          >
            {createBuilding.isPending
              ? t('saving') || 'Saving...'
              : t('save') || 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
