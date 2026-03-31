import { useRef, useState } from 'react'
import { Upload, Plus, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useBatchUploadFilesWithViews } from '../hooks/use-views'

interface UploadedFile {
  name: string
  file: File
  url?: string
}

export function ViewsBatchUploadForm() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addMoreInputRef = useRef<HTMLInputElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const batchUpload = useBatchUploadFilesWithViews()

  const processFiles = (files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files)
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true })
      )
      .map((file) => ({
        name: file.name.split('.')[0],
        file,
        url: URL.createObjectURL(file),
      }))

    setUploadedFiles((prev) => {
      const merged = [...prev, ...newFiles]
      return merged.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true })
      )
    })
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files
    if (!files) return

    processFiles(files)
    setIsDialogOpen(true)

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleAddMore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files
    if (!files) return

    processFiles(files)

    if (addMoreInputRef.current) addMoreInputRef.current.value = ''
  }

  const handleRemoveFile = (index: number) => {
    const file = uploadedFiles[index]
    if (file.url) URL.revokeObjectURL(file.url)
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleConfirmUpload = async () => {
    if (uploadedFiles.length === 0) return

    try {
      await batchUpload.mutateAsync(uploadedFiles)

      toast.success(
        t('batch_upload_success') || 'All views created successfully'
      )
      uploadedFiles.forEach((file) => {
        if (file.url) URL.revokeObjectURL(file.url)
      })
      setUploadedFiles([])
      setIsDialogOpen(false)
    } catch (err) {
      toast.error(t('batch_upload_error') || 'Error in batch upload')
    }
  }

  const handleCancel = () => {
    uploadedFiles.forEach((file) => {
      if (file.url) URL.revokeObjectURL(file.url)
    })
    setUploadedFiles([])
    setIsDialogOpen(false)
  }

  return (
    <>
      {/* Initial upload input */}
      <input
        ref={fileInputRef}
        type='file'
        multiple
        onChange={handleFileSelect}
        className='hidden'
        disabled={batchUpload.isPending}
      />
      {/* Add more input (inside dialog) */}
      <input
        ref={addMoreInputRef}
        type='file'
        multiple
        onChange={handleAddMore}
        className='hidden'
        disabled={batchUpload.isPending}
      />

      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={batchUpload.isPending}
        className='space-x-2'
      >
        <Upload size={18} />
        <span>
          {batchUpload.isPending
            ? t('loading')
            : t('batch_upload') || 'Batch Upload'}
        </span>
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>
              {t('pending_upload') || 'Batch Upload Preview'}
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='max-h-96 overflow-y-auto'>
              {uploadedFiles.length === 0 ? (
                <div
                  className='flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-muted-foreground transition-colors hover:border-primary hover:text-primary'
                  onClick={() => addMoreInputRef.current?.click()}
                >
                  <Plus size={32} className='mb-2' />
                  <p className='text-sm'>
                    {t('add_files') || 'Click to add files'}
                  </p>
                </div>
              ) : (
                <div className='space-y-2'>
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between rounded-lg border p-3'
                    >
                      <div className='flex flex-1 items-center gap-3'>
                        {file.url && (
                          <img
                            src={file.url}
                            alt={file.name}
                            className='h-12 w-12 rounded object-cover'
                          />
                        )}
                        <div className='flex-1'>
                          <p className='text-sm font-medium'>{file.name}</p>
                          <p className='text-xs text-muted-foreground'>
                            {(file.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleRemoveFile(index)}
                        disabled={batchUpload.isPending}
                        className='text-destructive hover:bg-destructive/10 hover:text-destructive'
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className='flex-row items-center sm:justify-between'>
            {/* Add more button — left side */}
            <Button
              type='button'
              variant='outline'
              onClick={() => addMoreInputRef.current?.click()}
              disabled={batchUpload.isPending}
              className='space-x-2'
            >
              <Plus size={16} />
              <span>{t('add_more') || 'Add More'}</span>
            </Button>

            {/* Cancel / Confirm — right side */}
            <div className='flex gap-2'>
              <Button
                variant='outline'
                onClick={handleCancel}
                disabled={batchUpload.isPending}
              >
                {t('cancel') || 'Cancel'}
              </Button>
              <Button
                onClick={handleConfirmUpload}
                disabled={uploadedFiles.length === 0 || batchUpload.isPending}
              >
                {batchUpload.isPending
                  ? `${t('loading')}...`
                  : `${t('confirm') || 'Confirm'} (${uploadedFiles.length})`}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
