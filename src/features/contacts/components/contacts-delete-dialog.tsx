import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { Contact } from '../data/schema'
import { useDeleteContact } from '../hooks/use-contacts'
import { useContactsContext } from './contacts-provider'

type ContactDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Contact
}

export function ContactsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: ContactDeleteDialogProps) {
  const { t } = useTranslation()
  const { setOpen } = useContactsContext()
  const deleteContact = useDeleteContact()

  const handleDelete = async () => {
    try {
      await deleteContact.mutateAsync(currentRow.id)
      toast.success(
        t('contact_deleted_success') || 'Contact deleted successfully'
      )
      onOpenChange(false)
      setOpen(null)
    } catch (err) {
      toast.error(t('contact_delete_error') || 'Failed to delete contact')
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={deleteContact.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle className='me-2 mb-1 inline-block' />
          {t('delete_contact')}
        </span>
      }
      desc={
        t('delete_confirm') ||
        'Are you sure you want to delete this contact? This action cannot be undone.'
      }
    />
  )
}
