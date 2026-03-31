'use client'

import { useRef, useState } from 'react'
import { Upload, X, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface PdfUploadProps {
  onFileSelect?: (file: File | null) => void
  isDisabled?: boolean
}

const PDF_MAGIC_BYTES = [0x25, 0x50, 0x44, 0x46] // %PDF

async function validatePdfMagicBytes(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const arr = new Uint8Array(e.target?.result as ArrayBuffer).subarray(0, 4)
      const isValidPdf =
        arr[0] === PDF_MAGIC_BYTES[0] &&
        arr[1] === PDF_MAGIC_BYTES[1] &&
        arr[2] === PDF_MAGIC_BYTES[2] &&
        arr[3] === PDF_MAGIC_BYTES[3]
      resolve(isValidPdf)
    }
    reader.readAsArrayBuffer(file.slice(0, 4))
  })
}

export function PdfUpload({
  onFileSelect,
  isDisabled = false,
}: PdfUploadProps) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [preview, setPreview] = useState<{ name: string; size: string } | null>(
    null
  )

  const processFile = async (file: File) => {
    // Check MIME type
    if (file.type !== 'application/pdf') {
      toast.error(t('file_must_be_pdf') || 'File must be a PDF')
      return
    }

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(t('pdf_too_large') || 'PDF is too large (max 50MB)')
      return
    }

    // Validate PDF magic bytes
    const isValidPdf = await validatePdfMagicBytes(file)
    if (!isValidPdf) {
      toast.error(t('invalid_pdf_format') || 'Invalid PDF format')
      return
    }

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2)
    setPreview({ name: file.name, size: `${sizeInMB} MB` })
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
    setPreview(null)
    onFileSelect?.(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className='space-y-3'>
      {preview ? (
        <div className='relative rounded-lg border border-gray-300 p-4'>
          <div className='flex items-center justify-between gap-3'>
            <div className='flex flex-1 items-center gap-3'>
              <FileText size={32} className='text-red-600' />
              <div className='flex-1'>
                <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  {preview.name}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  {preview.size}
                </p>
              </div>
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
            accept='.pdf,application/pdf'
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
                {t('drag_and_drop_pdf') || 'Drag and drop a PDF'}
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
