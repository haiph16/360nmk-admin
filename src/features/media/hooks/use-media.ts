import { AxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/axios'
import type { UtilityMedia } from '../../utility-medias/data/schema'

type UploadMediaResponse = {
  success: boolean
  message: string
  data: UtilityMedia
}

type UploadMultipleMediaResponse = {
  success: boolean
  message: string
  data: UtilityMedia[]
}

export function useUploadMedia() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post<UploadMediaResponse>(
        '/media/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data.data
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to upload media'
      toast.error(message || 'Error uploading media')
    },
  })
}

export function useUploadMultipleMedia() {
  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append(`files`, file)
      })

      const response = await api.post<UploadMultipleMediaResponse>(
        '/media/upload-multiple',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data.data
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to upload media files'
      toast.error(message || 'Error uploading media files')
    },
  })
}
