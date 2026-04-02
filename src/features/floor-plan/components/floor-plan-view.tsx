import {
  Building2,
  ChevronDown,
  Home,
  Layers,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import type {
  FloorPlanApartment,
  FloorPlanBuilding,
  FloorPlanFloor,
} from '../data/schema'
import { useFloorPlanTree } from '../hooks/use-floor-plan'
import { FloorPlanDialogs } from './floor-plan-dialogs'
import { FloorPlanPrimaryButtons } from './floor-plan-primary-buttons'
import { FloorPlanProvider, useFloorPlanContext } from './floor-plan-provider'

function FloorPlanContent() {
  const { t } = useTranslation()
  const { data: buildings = [], isLoading, isError } = useFloorPlanTree()

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {t('floor_plan') || 'Floor plan'}
            </h2>
            <p className='text-muted-foreground'>
              {t('floor_plan_desc') || 'Building → Floor → Apartment'}
            </p>
          </div>
          <FloorPlanPrimaryButtons />
        </div>

        {isLoading && (
          <p className='text-muted-foreground'>
            {t('loading') || 'Loading...'}
          </p>
        )}
        {isError && <p className='text-destructive'>{t('error') || 'Error'}</p>}
        {!isLoading && !isError && buildings.length === 0 && (
          <p className='text-muted-foreground'>
            {t('no_data') || 'No buildings yet.'}
          </p>
        )}

        <div className='space-y-3'>
          {buildings.map((b) => (
            <BuildingCard key={b.id} building={b} />
          ))}
        </div>
      </Main>

      <FloorPlanDialogs />
    </>
  )
}

function BuildingCard({ building }: { building: FloorPlanBuilding }) {
  const { t } = useTranslation()
  const { setOpen, setCurrentBuilding, setCurrentFloor } = useFloorPlanContext()

  return (
    <Collapsible defaultOpen className='group rounded-lg border bg-card'>
      <div className='flex items-center justify-between gap-2 border-b px-4 py-3'>
        <CollapsibleTrigger className='flex flex-1 items-center gap-2 text-start font-semibold hover:opacity-80'>
          <ChevronDown className='h-4 w-4 shrink-0 transition-transform group-data-[state=closed]:-rotate-90' />
          <Building2 className='h-4 w-4 shrink-0' />
          <span className='truncate'>{building.name}</span>
        </CollapsibleTrigger>
        <div className='flex shrink-0 gap-1'>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8'
            title={t('edit') || 'Edit'}
            onClick={() => {
              setCurrentBuilding(building)
              setOpen('edit-building')
            }}
          >
            <Pencil className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-destructive'
            title={t('delete') || 'Delete'}
            onClick={() => {
              setCurrentBuilding(building)
              setOpen('delete-building')
            }}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </div>
      <CollapsibleContent>
        <div className='space-y-2 border-t bg-muted/20 p-4'>
          <div className='flex justify-end'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                setCurrentBuilding(building)
                setCurrentFloor(null)
                setOpen('add-floor')
              }}
            >
              <Plus className='me-1 h-3 w-3' />
              {t('add_floor') || 'Add floor'}
            </Button>
          </div>
          {(building.floors ?? []).map((floor) => (
            <FloorSection key={floor.id} building={building} floor={floor} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function FloorSection({
  building,
  floor,
}: {
  building: FloorPlanBuilding
  floor: FloorPlanFloor
}) {
  const { t } = useTranslation()
  const { setOpen, setCurrentBuilding, setCurrentFloor } = useFloorPlanContext()

  const apartments = floor.apartments ?? []

  return (
    <Collapsible defaultOpen className='group rounded-md border bg-background'>
      <div className='flex flex-wrap items-center justify-between gap-2 px-3 py-2'>
        <CollapsibleTrigger className='flex min-w-0 flex-1 items-center gap-2 text-start text-sm font-medium hover:opacity-80'>
          <ChevronDown className='h-3.5 w-3.5 shrink-0 transition-transform group-data-[state=closed]:-rotate-90' />
          <Layers className='h-3.5 w-3.5 shrink-0' />
          <span className='truncate'>{floor.name}</span>
        </CollapsibleTrigger>
        <div className='flex gap-1'>
          <Button
            variant='ghost'
            size='sm'
            className='h-8'
            onClick={() => {
              setCurrentBuilding(building)
              setCurrentFloor(floor)
              setOpen('add-apartment')
            }}
          >
            <Home className='me-1 h-3 w-3' />
            {t('add_apartment') || 'Apartment'}
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8'
            onClick={() => {
              setCurrentFloor(floor)
              setOpen('edit-floor')
            }}
          >
            <Pencil className='h-3.5 w-3.5' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-destructive'
            onClick={() => {
              setCurrentFloor(floor)
              setOpen('delete-floor')
            }}
          >
            <Trash2 className='h-3.5 w-3.5' />
          </Button>
        </div>
      </div>
      <CollapsibleContent>
        <div className='border-t px-3 pb-3'>
          {(floor.img_url || floor.image) && (
            <img
              src={floor.img_url || floor.image || ''}
              alt=''
              className='mt-2 mb-2 max-h-40 w-full rounded object-contain'
            />
          )}
          <div className='overflow-hidden rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('name') || 'Name'}</TableHead>
                  <TableHead>{t('area') || 'Area'}</TableHead>
                  <TableHead>{t('total_floor_area') || 'Floor Area'}</TableHead>
                  <TableHead>{t('direction') || 'Direction'}</TableHead>
                  <TableHead className='w-[100px]' />
                </TableRow>
              </TableHeader>
              <TableBody>
                {apartments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className='text-muted-foreground'>
                      {t('no_apartments') || 'No apartments'}
                    </TableCell>
                  </TableRow>
                ) : (
                  apartments.map((apt) => (
                    <ApartmentRow key={apt.id} floor={floor} apt={apt} />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function ApartmentRow({
  floor,
  apt,
}: {
  floor: FloorPlanFloor
  apt: FloorPlanApartment
}) {
  const { setOpen, setCurrentFloor, setCurrentApartment } =
    useFloorPlanContext()

  return (
    <TableRow>
      <TableCell className='font-medium'>{apt.apartmentName || '—'}</TableCell>
      <TableCell>{apt.landArea ?? '—'}</TableCell>
      <TableCell>{apt.totalFloorArea ?? '—'}</TableCell>
      <TableCell>{apt.landDirection ?? '—'}</TableCell>
      <TableCell>
        <div className='flex justify-end gap-1'>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8'
            onClick={() => {
              setCurrentFloor(floor)
              setCurrentApartment(apt)
              setOpen('edit-apartment')
            }}
          >
            <Pencil className='h-3.5 w-3.5' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-destructive'
            onClick={() => {
              setCurrentFloor(floor)
              setCurrentApartment(apt)
              setOpen('delete-apartment')
            }}
          >
            <Trash2 className='h-3.5 w-3.5' />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export function FloorPlan() {
  return (
    <FloorPlanProvider>
      <FloorPlanContent />
    </FloorPlanProvider>
  )
}
