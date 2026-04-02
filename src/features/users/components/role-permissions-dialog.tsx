import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { usePermissions } from '../hooks/use-permissions'
import { useRoles, type Role } from '../hooks/use-roles'

interface RolePermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Role | null
}

export function RolePermissionsDialog({
  open,
  onOpenChange,
  currentRow,
}: RolePermissionsDialogProps) {
  const { t } = useTranslation()
  const { data: permissions, isLoading: isLoadingPermissions } =
    usePermissions()
  const { assignPermissionsMutation } = useRoles()

  // Initialize state directly since the component remounts via 'key' in parent
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    () => currentRow?.permissions?.map((p) => p.id) || []
  )

  const handleTogglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handleSave = () => {
    if (!currentRow) return
    assignPermissionsMutation.mutate(
      {
        roleId: currentRow.id,
        permissionIds: selectedPermissions,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>
            {t('manage_permissions_for', { name: currentRow?.name })}
          </DialogTitle>
          <DialogDescription>{t('select_permissions_desc')}</DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          {isLoadingPermissions ? (
            <div className='py-4 text-center'>{t('loading')}</div>
          ) : (
            <ScrollArea className='h-[300px] pr-4'>
              <div className='grid grid-cols-1 gap-4'>
                {permissions?.map((permission) => (
                  <div
                    key={permission.id}
                    className='flex cursor-pointer items-center space-x-2 rounded-md border p-3 hover:bg-muted/50'
                    onClick={() => handleTogglePermission(permission.id)}
                  >
                    <Checkbox
                      id={permission.id}
                      checked={selectedPermissions.includes(permission.id)}
                      onCheckedChange={() =>
                        handleTogglePermission(permission.id)
                      }
                    />
                    <div className='flex flex-col'>
                      <label
                        htmlFor={permission.id}
                        className='cursor-pointer text-sm leading-none font-medium'
                      >
                        {permission.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={assignPermissionsMutation.isPending}
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSave}
            loading={assignPermissionsMutation.isPending}
          >
            {t('save_changes')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
