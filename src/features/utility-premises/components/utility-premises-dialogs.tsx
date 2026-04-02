import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload, X } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImageUpload } from '@/components/image-upload'
import { useUploadMultipleMedia } from '../../media/hooks/use-media'
import type { UtilityMedia } from '../../utility-medias/data/schema'
import { utilityPremiseSchema } from '../data/schema'
import type {
  UtilityPremise,
  UtilityPremiseCreatePayload,
} from '../data/schema'
import {
  useCreateUtilityPremise,
  useUpdateUtilityPremise,
  useDeleteUtilityPremise,
  useUtilityPremisesParents,
} from '../hooks/use-utility-premises'
import { useUtilityPremisesContext } from './utility-premises-provider'

interface UtilityPremisesDialogsProps {
  currentPremise: UtilityPremise | null
  parentId: number | null
}

export function UtilityPremisesDialogs({
  currentPremise,
  parentId,
}: UtilityPremisesDialogsProps) {
  const { open, setOpen, setCurrentPremise, setParentId } =
    useUtilityPremisesContext()
  const pendingFileRef = useRef<File | null>(null)
  const [pendingMediaFiles, setPendingMediaFiles] = useState<File[]>([])
  const [uploadedMedia, setUploadedMedia] = useState<UtilityMedia[]>([])

  const createMutation = useCreateUtilityPremise()
  const updateMutation = useUpdateUtilityPremise()
  const deleteMutation = useDeleteUtilityPremise()
  const uploadMultipleMutation = useUploadMultipleMedia()
  const { data: parentOptions = [] } = useUtilityPremisesParents()

  const handleAddMediaFile = (file: File | null) => {
    if (file) {
      setPendingMediaFiles((prev) => [...prev, file])
    }
  }

  const handleRemoveMediaFile = (index: number) => {
    setPendingMediaFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUploadMediaFiles = async () => {
    if (pendingMediaFiles.length === 0) return

    uploadMultipleMutation.mutate(pendingMediaFiles, {
      onSuccess: (data) => {
        setUploadedMedia((prev) => [...prev, ...data])
        setPendingMediaFiles([])
      },
    })
  }

  const form = useForm<UtilityPremiseCreatePayload>({
    resolver: zodResolver(utilityPremiseSchema),
    defaultValues: {
      parentId: undefined,
      name: '',
      image: undefined,
      coordinatesX: undefined,
      coordinatesY: undefined,
    },
  })

  const handleCreateOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(null)
      setTimeout(() => {
        setParentId(null)
        setPendingMediaFiles([])
        setUploadedMedia([])
        form.reset()
      }, 500)
    } else {
      setPendingMediaFiles([])
      setUploadedMedia([])
      form.reset({
        parentId: parentId || undefined,
        name: '',
        image: undefined,
        coordinatesX: undefined,
        coordinatesY: undefined,
      })
    }
  }

  const handleEditOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(null)
      setTimeout(() => {
        setCurrentPremise(null)
        setPendingMediaFiles([])
        setUploadedMedia([])
        form.reset()
      }, 500)
    } else if (currentPremise) {
      setPendingMediaFiles([])
      setUploadedMedia([])
      form.reset({
        parentId: currentPremise.parentId || undefined,
        name: currentPremise.name,
        image: undefined,
        coordinatesX: currentPremise.coordinatesX,
        coordinatesY: currentPremise.coordinatesY,
      })
    }
  }

  const onSubmitCreate = async (data: UtilityPremiseCreatePayload) => {
    const formData = new FormData()
    formData.append('name', data.name)
    if (data.parentId) formData.append('parentId', String(data.parentId))
    if (pendingFileRef.current) formData.append('image', pendingFileRef.current)
    if (data.coordinatesX)
      formData.append('coordinatesX', String(data.coordinatesX))
    if (data.coordinatesY)
      formData.append('coordinatesY', String(data.coordinatesY))

    // Add uploaded media IDs
    uploadedMedia.forEach((media, index) => {
      formData.append(`mediaIds[${index}]`, String(media.id))
    })

    createMutation.mutate(formData as any, {
      onSuccess: () => {
        form.reset()
        pendingFileRef.current = null
        setPendingMediaFiles([])
        setUploadedMedia([])
        setParentId(null)
        setOpen(null)
      },
    })
  }

  const onSubmitEdit = async (data: UtilityPremiseCreatePayload) => {
    if (!currentPremise) return

    const formData = new FormData()
    formData.append('name', data.name)
    if (data.parentId) formData.append('parentId', String(data.parentId))
    if (pendingFileRef.current) formData.append('image', pendingFileRef.current)
    if (data.coordinatesX)
      formData.append('coordinatesX', String(data.coordinatesX))
    if (data.coordinatesY)
      formData.append('coordinatesY', String(data.coordinatesY))

    // Add uploaded media IDs
    uploadedMedia.forEach((media, index) => {
      formData.append(`mediaIds[${index}]`, String(media.id))
    })

    updateMutation.mutate(
      { id: currentPremise.id, data: formData as any },
      {
        onSuccess: () => {
          form.reset()
          pendingFileRef.current = null
          setPendingMediaFiles([])
          setUploadedMedia([])
          setCurrentPremise(null)
          setOpen(null)
        },
      }
    )
  }

  const onSubmitDelete = () => {
    if (!currentPremise) return
    deleteMutation.mutate(currentPremise.id, {
      onSuccess: () => {
        setCurrentPremise(null)
        setOpen(null)
      },
    })
  }

  return (
    <>
      {/* Create Dialog */}
      <Dialog open={open === 'create'} onOpenChange={handleCreateOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-xl'>Thêm khu vực tiện ích</DialogTitle>
            <DialogDescription>
              Tạo một khu vực tiện ích mới trong hệ thống
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitCreate)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tên <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Nhập tên khu vực' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='parentId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Khu vực cha</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ? String(field.value) : ''}
                        onValueChange={(value) =>
                          field.onChange(value ? parseInt(value) : undefined)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn khu vực cha' />
                        </SelectTrigger>
                        <SelectContent>
                          {parentOptions.map((parent) => (
                            <SelectItem
                              key={parent.id}
                              value={String(parent.id)}
                            >
                              {parent.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <p className='mt-1 text-xs text-muted-foreground'>
                      Để trống để không có khu vực cha
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='coordinatesX'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tọa độ trái</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='0'
                          type='number'
                          step='0.01'
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        Để trống để không gửi
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='coordinatesY'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tọa độ trên</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='0'
                          type='number'
                          step='0.01'
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        Để trống để không gửi
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='image'
                render={() => (
                  <FormItem>
                    <FormLabel>Ảnh mặt bằng (Plan)</FormLabel>
                    <FormControl>
                      <ImageUpload
                        onFileSelect={(file) => {
                          pendingFileRef.current = file
                        }}
                      />
                    </FormControl>
                    <p className='mt-1 text-xs text-muted-foreground'>
                      Để trống để không gửi
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='medias'
                render={() => (
                  <FormItem>
                    <FormLabel>Danh sách ảnh/video đính kèm</FormLabel>
                    <FormControl>
                      <div className='space-y-3'>
                        <ImageUpload
                          onFileSelect={(file) => {
                            handleAddMediaFile(file)
                          }}
                        />
                        {pendingMediaFiles.length > 0 && (
                          <div className='space-y-3 rounded-lg border p-3'>
                            <div className='space-y-2'>
                              <div className='text-sm font-medium text-muted-foreground'>
                                Chủ yếu tải lên ({pendingMediaFiles.length}):
                              </div>
                              {pendingMediaFiles.map((file, index) => (
                                <div
                                  key={`pending-${file.name}-${index}`}
                                  className='flex items-center justify-between rounded bg-muted p-2'
                                >
                                  <span className='text-sm'>{file.name}</span>
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => handleRemoveMediaFile(index)}
                                  >
                                    <X className='h-4 w-4' />
                                  </Button>
                                </div>
                              ))}
                            </div>
                            <Button
                              type='button'
                              variant='secondary'
                              size='sm'
                              className='w-full'
                              onClick={handleUploadMediaFiles}
                              loading={uploadMultipleMutation.isPending}
                              disabled={uploadMultipleMutation.isPending}
                            >
                              <Upload className='mr-2 h-4 w-4' />
                              Tải lên {pendingMediaFiles.length} tệp
                            </Button>
                          </div>
                        )}

                        {uploadedMedia.length > 0 && (
                          <div className='space-y-2 rounded-lg border border-green-200 bg-green-50 p-3'>
                            <div className='text-sm font-medium text-green-900'>
                              Đã tải lên ({uploadedMedia.length}):
                            </div>
                            {uploadedMedia.map((media) => (
                              <div
                                key={media.id}
                                className='flex items-center justify-between rounded bg-white p-2'
                              >
                                <div className='flex-1'>
                                  <p className='text-sm font-medium'>
                                    {media.type === 'image' ? '🖼️' : '🎥'}{' '}
                                    {media.url || 'Media'}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <p className='mt-1 text-xs text-muted-foreground'>
                      Chọn tệp và nhấp "Tải lên" trước khi gửi
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className='gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => handleCreateOpenChange(false)}
                >
                  Hủy
                </Button>
                <Button
                  type='submit'
                  loading={createMutation.isPending}
                  disabled={createMutation.isPending}
                  onClick={() => onSubmitCreate(form.getValues())}
                >
                  Tạo
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={open === 'edit'} onOpenChange={handleEditOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-xl'>Chỉnh sửa khu vực</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin khu vực tiện ích
            </DialogDescription>
          </DialogHeader>

          {currentPremise && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitEdit)}
                className='space-y-4'
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tên <span className='text-destructive'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Nhập tên khu vực' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='parentId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Khu vực cha</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ? String(field.value) : ''}
                          onValueChange={(value) =>
                            field.onChange(value ? parseInt(value) : undefined)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn khu vực cha' />
                          </SelectTrigger>
                          <SelectContent>
                            {parentOptions.map((parent) => (
                              <SelectItem
                                key={parent.id}
                                value={String(parent.id)}
                              >
                                {parent.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        Để trống để không có khu vực cha
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='coordinatesX'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tọa độ trái</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='0'
                            type='number'
                            step='0.01'
                            value={field.value ?? ''}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <p className='mt-1 text-xs text-muted-foreground'>
                          Để trống để không gửi
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='coordinatesY'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tọa độ trên</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='0'
                            type='number'
                            step='0.01'
                            value={field.value ?? ''}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <p className='mt-1 text-xs text-muted-foreground'>
                          Để trống để không gửi
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {currentPremise.image && (
                  <div className='space-y-2'>
                    <FormLabel>Ảnh mặt bằng hiện tại</FormLabel>
                    <img
                      src={currentPremise.image}
                      alt={currentPremise.name}
                      className='h-24 w-24 rounded object-cover'
                    />
                  </div>
                )}

                <FormField
                  control={form.control}
                  name='image'
                  render={() => (
                    <FormItem>
                      <FormLabel>Ảnh mặt bằng (Plan) mới</FormLabel>
                      <FormControl>
                        <ImageUpload
                          onFileSelect={(file) => {
                            pendingFileRef.current = file
                          }}
                        />
                      </FormControl>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        Để trống để không gửi
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='medias'
                  render={() => (
                    <FormItem>
                      <FormLabel>Danh sách ảnh/video đính kèm</FormLabel>
                      <FormControl>
                        <div className='space-y-3'>
                          <ImageUpload
                            onFileSelect={(file) => {
                              handleAddMediaFile(file)
                            }}
                          />
                          {pendingMediaFiles.length > 0 && (
                            <div className='space-y-3 rounded-lg border p-3'>
                              <div className='space-y-2'>
                                <div className='text-sm font-medium text-muted-foreground'>
                                  Chủ yếu tải lên ({pendingMediaFiles.length}):
                                </div>
                                {pendingMediaFiles.map((file, index) => (
                                  <div
                                    key={`pending-${file.name}-${index}`}
                                    className='flex items-center justify-between rounded bg-muted p-2'
                                  >
                                    <span className='text-sm'>{file.name}</span>
                                    <Button
                                      type='button'
                                      variant='ghost'
                                      size='sm'
                                      onClick={() =>
                                        handleRemoveMediaFile(index)
                                      }
                                    >
                                      <X className='h-4 w-4' />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                              <Button
                                type='button'
                                variant='secondary'
                                size='sm'
                                className='w-full'
                                onClick={handleUploadMediaFiles}
                                loading={uploadMultipleMutation.isPending}
                                disabled={uploadMultipleMutation.isPending}
                              >
                                <Upload className='mr-2 h-4 w-4' />
                                Tải lên {pendingMediaFiles.length} tệp
                              </Button>
                            </div>
                          )}

                          {uploadedMedia.length > 0 && (
                            <div className='space-y-2 rounded-lg border border-green-200 bg-green-50 p-3'>
                              <div className='text-sm font-medium text-green-900'>
                                Đã tải lên ({uploadedMedia.length}):
                              </div>
                              {uploadedMedia.map((media) => (
                                <div
                                  key={media.id}
                                  className='flex items-center justify-between rounded bg-white p-2'
                                >
                                  <div className='flex-1'>
                                    <p className='text-sm font-medium'>
                                      {media.type === 'image' ? '🖼️' : '🎥'}{' '}
                                      {media.url || 'Media'}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        Chọn tệp và nhấp "Tải lên" trước khi gửi
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className='gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => handleEditOpenChange(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    type='submit'
                    loading={updateMutation.isPending}
                    disabled={updateMutation.isPending}
                  >
                    Cập nhật
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={open === 'delete'}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa khu vực</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khu vực này không? Hành động này không
              thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setOpen(null)
                setTimeout(() => setCurrentPremise(null), 500)
              }}
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onSubmitDelete}
              disabled={deleteMutation.isPending}
              className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
