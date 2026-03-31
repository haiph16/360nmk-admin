import { ContactsActionDialog } from './contacts-action-dialog'
import { ContactsDeleteDialog } from './contacts-delete-dialog'
import { useContactsContext } from './contacts-provider'

export function ContactsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useContactsContext()

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
      <ContactsActionDialog
        key='contact-add'
        open={open === 'add'}
        onOpenChange={handleAddOpenChange}
      />

      {currentRow && (
        <>
          <ContactsActionDialog
            key={`contact-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={handleEditOpenChange}
            currentRow={currentRow}
          />

          <ContactsDeleteDialog
            key={`contact-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={handleDeleteOpenChange}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
