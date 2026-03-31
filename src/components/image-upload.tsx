'use client'

import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  onFileSelect?: (file: File | null) => void
  onRemoveExisting?: (removed: boolean) => void
  isDisabled?: boolean
  initialPreview?: { url: string; name: string }
}

export function ImageUpload({
  onFileSelect,
  onRemoveExisting,
  isDisabled = false,
  initialPreview,
}: ImageUploadProps) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  // Khởi tạo trực tiếp từ initialPreview, không dùng useEffect để sync
  // Component sẽ được reset hoàn toàn qua key prop từ parent khi cần
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(
    initialPreview || null
  )

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error(t('file_must_be_image') || 'File must be an image')
      return
    }
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(t('file_too_large') || 'File is too large (max 10MB)')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview({ url: objectUrl, name: file.name })
    onFileSelect?.(file)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    processFile(file)
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
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const handleRemove = () => {
    const hasExisting = !!initialPreview
    if (preview?.url && !hasExisting) URL.revokeObjectURL(preview.url)
    setPreview(null)
    onFileSelect?.(null)
    onRemoveExisting?.(hasExisting)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className='space-y-3'>
      {preview ? (
        <div className='relative rounded-lg border border-gray-300 p-4'>
          <div className='flex items-start justify-between gap-2'>
            <div className='flex-1'>
              <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                {preview.name}
              </p>
              <img
                src={preview.url}
                alt={preview.name}
                className='mt-2 max-h-40 rounded object-cover'
              />
            </div>
            <button
              onClick={handleRemove}
              disabled={isDisabled}
              className='rounded p-1 text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950'
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
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
                {t('drag_and_drop') || 'Drag and drop an image'}
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
      )}
    </div>
  )
}
