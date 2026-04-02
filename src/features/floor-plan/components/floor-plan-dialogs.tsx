import { FloorPlanApartmentDialog } from './floor-plan-apartment-dialog'
import { FloorPlanBuildingCreateDialog } from './floor-plan-building-create-dialog'
import { FloorPlanBuildingEditDialog } from './floor-plan-building-edit-dialog'
import { FloorPlanDeleteDialog } from './floor-plan-delete-dialog'
import { FloorPlanFloorDialog } from './floor-plan-floor-dialog'

export function FloorPlanDialogs() {
  return (
    <>
      <FloorPlanBuildingCreateDialog />
      <FloorPlanBuildingEditDialog />
      <FloorPlanFloorDialog />
      <FloorPlanApartmentDialog />
      <FloorPlanDeleteDialog />
    </>
  )
}
