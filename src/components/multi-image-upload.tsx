'use client'

import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface MultiImageUploadProps {
  onFilesSelect?: (files: File[]) => void
  onRemoveExisting?: (removed: boolean) => void
  isDisabled?: boolean
  initialPreviews?: Array<{ url: string; name: string }>
}

export function MultiImageUpload({
  onFilesSelect,
  onRemoveExisting,
  isDisabled = false,
  initialPreviews = [],
}: MultiImageUploadProps) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [previews, setPreviews] = useState<
    Array<{ url: string; name: string; isNew?: boolean }>
  >(initialPreviews.map((p) => ({ ...p, isNew: false })))
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const processFiles = (files: FileList | null) => {
    if (!files) return

    const newFiles: File[] = []
    const newPreviews: Array<{ url: string; name: string; isNew: boolean }> = []

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(t('file_must_be_image') || 'File must be an image')
        return
      }
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        toast.error(t('file_too_large') || 'File is too large (max 10MB)')
        return
      }

      newFiles.push(file)
      const objectUrl = URL.createObjectURL(file)
      newPreviews.push({ url: objectUrl, name: file.name, isNew: true })
    })

    if (newFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...newFiles])
      setPreviews((prev) => [...prev, ...newPreviews])
      onFilesSelect?.([...selectedFiles, ...newFiles])
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(event.target.files)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    processFiles(e.dataTransfer.files)
  }

  const handleRemovePreview = (index: number) => {
    const preview = previews[index]

    if (preview.isNew) {
      // Remove new file
      setSelectedFiles((prev) => {
        const newFiles = [...prev]
        newFiles.splice(index - (previews.length - selectedFiles.length), 1)
        onFilesSelect?.(newFiles)
        return newFiles
      })
    } else {
      // Mark existing as removed
      onRemoveExisting?.(true)
    }

    if (preview.url.startsWith('blob:')) URL.revokeObjectURL(preview.url)
    setPreviews((prev) => prev.filter((_, i) => i !== index))

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className='space-y-3'>
      {previews.length > 0 && (
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4'>
          {previews.map((preview, index) => (
            <div
              key={index}
              className='group relative overflow-hidden rounded-xl border bg-gray-100 dark:bg-gray-800'
            >
              <img
                src={preview.url}
                alt={preview.name}
                className='h-32 w-full object-cover transition-transform group-hover:scale-105'
              />

              {/* Overlay */}
              <div className='absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100'>
                <button
                  onClick={() => handleRemovePreview(index)}
                  disabled={isDisabled}
                  className='rounded-full bg-white/90 p-2 text-red-600 shadow hover:bg-white disabled:opacity-50'
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          isDragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
            : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
        }`}
      >
        <input
          ref={fileInputRef}
          type='file'
          onChange={handleFileSelect}
          className='hidden'
          disabled={isDisabled}
          accept='image/*'
          multiple
        />
        <div className='space-y-2'>
          <div className='flex justify-center'>
            <Upload
              size={28}
              className={`${isDragOver ? 'text-blue-500' : 'text-gray-400'} transition-colors`}
            />
          </div>
          <div>
            <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              {t('drag_and_drop') || 'Drag and drop images'}
            </p>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              {t('or_click_to_browse') || 'or click to browse'}
            </p>
          </div>
          <Button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            disabled={isDisabled}
            size='sm'
            variant='outline'
          >
            {t('choose_file')}
          </Button>
        </div>
      </div>
    </div>
  )
}
