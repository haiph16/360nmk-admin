import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiUploadFile } from '@/lib/api-request'
import api from '@/lib/axios'
import type {
  Product,
  ProductCreatePayload,
  ProductsResponse,
} from '../data/schema'

export function useProducts(page?: number, pageSize?: number, search?: string) {
  return useQuery({
    queryKey: ['products', page, pageSize, search],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (page !== undefined) params.append('page', String(page))
      if (pageSize !== undefined) params.append('limit', String(pageSize))
      if (search) params.append('search', search)

      const response = await api.get<ProductsResponse>(
        `/products?${params.toString()}`
      )
      return response.data
    },
    retry: 1,
  })
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const response = await api.get<{ data: Product }>(`/products/${id}`)
      return response.data.data
    },
    enabled: id > 0,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ProductCreatePayload) => {
      const response = await api.post<{ data: Product }>('/products', data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product created successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to create product'
      toast.error(message || 'Error creating product')
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: Partial<ProductCreatePayload>
    }) => {
      const response = await api.put<{ data: Product }>(`/products/${id}`, data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product updated successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to update product'
      toast.error(message || 'Error updating product')
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/products/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product deleted successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to delete product'
      toast.error(message || 'Error deleting product')
    },
  })
}

export interface BatchUploadFile {
  name: string
  file: File
  url?: string
}

export function useBatchUploadFilesWithProducts(parentId: number) {
  const queryClient = useQueryClient()
  const createProduct = useCreateProduct()

  return useMutation({
    mutationFn: async (files: BatchUploadFile[]) => {
      const sortedFiles = [...files].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true })
      )

      const results = []
      for (let index = 0; index < sortedFiles.length; index++) {
        const file = sortedFiles[index]

        // Step 1: Upload file → get media_id
        const uploadResponse = await apiUploadFile('/media/upload', file.file)
        const mediaId =
          (uploadResponse as any)?.data?.id ?? (uploadResponse as any)?.id

        // Step 2: Create product with media_id and position
        const productData = await createProduct.mutateAsync({
          name: file.name,
          parent_id: parentId,
          media_items: [{ media_id: mediaId, position: index }],
        })

        results.push(productData)
      }

      return results
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useUploadMediaFile() {
  return useMutation({
    mutationFn: async (file: File) => {
      const response = await apiUploadFile('/media/upload', file)
      const mediaId = (response as any)?.data?.id ?? (response as any)?.id
      return mediaId
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
