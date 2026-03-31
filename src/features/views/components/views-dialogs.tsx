import { ViewsActionDialog } from './views-action-dialog'
import { ViewsDeleteDialog } from './views-delete-dialog'
import { useViewsContext } from './views-provider'

export function ViewsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useViewsContext()

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
      <ViewsActionDialog
        key='view-add'
        open={open === 'add'}
        onOpenChange={handleAddOpenChange}
      />

      {currentRow && (
        <>
          <ViewsActionDialog
            key={`view-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={handleEditOpenChange}
            currentRow={currentRow}
          />
          <ViewsDeleteDialog
            key={`view-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={handleDeleteOpenChange}
          />
        </>
      )}
    </>
  )
}
