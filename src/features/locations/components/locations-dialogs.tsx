import { LocationsActionDialog } from './locations-action-dialog'
import { LocationsDeleteDialog } from './locations-delete-dialog'
import { useLocationsContext } from './locations-provider'

export function LocationsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useLocationsContext()

  const handleAddOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(null)
    }
  }

  const handleEditOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(null)
      setTimeout(() => setCurrentRow(null), 500)
    }
  }

  const handleDeleteOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(null)
      setTimeout(() => setCurrentRow(null), 500)
    }
  }

  return (
    <>
      <LocationsActionDialog
        key='location-add'
        open={open === 'add'}
        onOpenChange={handleAddOpenChange}
      />

      {currentRow && (
        <>
          <LocationsActionDialog
            key={`location-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={handleEditOpenChange}
            currentRow={currentRow}
          />

          <LocationsDeleteDialog
            key={`location-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={handleDeleteOpenChange}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
