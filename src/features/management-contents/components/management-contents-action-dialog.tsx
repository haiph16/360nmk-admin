import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { apiUploadFile } from '@/lib/api-request'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { PdfUpload } from '@/components/pdf-upload'
import type { ManagementContent } from '../data/schema'
import {
  useCreateManagementContent,
  useUpdateManagementContent,
} from '../hooks/use-management-contents'
import { useManagementContentsContext } from './management-contents-provider'

interface ManagementContentsActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: ManagementContent | null
}

export function ManagementContentsActionDialog({
  open,
  onOpenChange,
  currentRow,
}: ManagementContentsActionDialogProps) {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow } = useManagementContentsContext()
  const createContent = useCreateManagementContent()
  const updateContent = useUpdateManagementContent()

  const isEdit = !!currentRow
  const [name, setName] = useState(currentRow?.name || '')
  const [mediaId] = useState(currentRow?.media_id || null)
  const pendingFileRef = useRef<File | null>(null)

  const handleSave = async () => {
    try {
      let finalMediaId: number | null = mediaId

      // Upload ảnh tại đây, đúng lúc submit
      if (pendingFileRef.current) {
        const response = await apiUploadFile(
          '/media/upload',
          pendingFileRef.current
        )
        finalMediaId = response.data?.id ?? response.id ?? null
      }

      if (isEdit && currentRow) {
        await updateContent.mutateAsync({
          id: currentRow.id,
          name,
          media_id: finalMediaId,
          position: currentRow.position,
          createdAt: currentRow.createdAt,
          updatedAt: currentRow.updatedAt,
        })
        toast.success(t('save_success') || 'Saved successfully')
      } else {
        await createContent.mutateAsync({
          name,
          media_id: finalMediaId,
        })
        toast.success(t('save_success') || 'Saved successfully')
      }
      onOpenChange(false)
      setOpen(null)
      setCurrentRow(null)
      pendingFileRef.current = null
    } catch (err) {
      toast.error(t('save_error') || 'Error occurred')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t('edit_management_content') || 'Edit Management Content'
              : t('add_management_content') || 'Add Management Content'}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <label className='mb-2 block text-sm font-medium'>
              {t('name') || 'Name'}
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('enter_name') || 'Enter name'}
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium'>
              {t('pdf') || 'PDF'}
            </label>
            <PdfUpload
              onFileSelect={(file) => {
                pendingFileRef.current = file
              }}
              isDisabled={createContent.isPending || updateContent.isPending}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={createContent.isPending || updateContent.isPending}
          >
            {t('cancel') || 'Cancel'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={createContent.isPending || updateContent.isPending}
          >
            {createContent.isPending || updateContent.isPending
              ? `${t('saving') || 'Saving'}...`
              : t('save') || 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
