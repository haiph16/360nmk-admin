import { ManagementContentsActionDialog } from './management-contents-action-dialog'
import { ManagementContentsDeleteDialog } from './management-contents-delete-dialog'
import { useManagementContentsContext } from './management-contents-provider'

export function ManagementContentsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } =
    useManagementContentsContext()

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
      <ManagementContentsActionDialog
        key='content-add'
        open={open === 'add'}
        onOpenChange={handleAddOpenChange}
      />

      {currentRow && (
        <>
          <ManagementContentsActionDialog
            key={`content-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={handleEditOpenChange}
            currentRow={currentRow}
          />
          <ManagementContentsDeleteDialog
            key={`content-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={handleDeleteOpenChange}
          />
        </>
      )}
    </>
  )
}
