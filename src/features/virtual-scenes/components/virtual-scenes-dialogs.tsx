import { VirtualScenesActionDialog } from './virtual-scenes-action-dialog'
import { VirtualScenesDeleteDialog } from './virtual-scenes-delete-dialog'
import { useVirtualScenesContext } from './virtual-scenes-provider'

export function VirtualScenesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useVirtualScenesContext()

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
      <VirtualScenesActionDialog
        key='virtual-scene-add'
        open={open === 'add'}
        onOpenChange={handleAddOpenChange}
      />

      {currentRow && (
        <>
          <VirtualScenesActionDialog
            key={`virtual-scene-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={handleEditOpenChange}
            currentRow={currentRow}
          />

          <VirtualScenesDeleteDialog
            key={`virtual-scene-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={handleDeleteOpenChange}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
