import { RegionLinksEditDialog } from './region-links-edit-dialog'
import { useRegionLinksContext } from './region-links-provider'

export function RegionLinksDialogs() {
  const { open, setOpen, currentRegionLink, setCurrentRegionLink } =
    useRegionLinksContext()

  const handleEditOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(null)
      setTimeout(() => setCurrentRegionLink(null), 500)
    }
  }

  return (
    <>
      {currentRegionLink && (
        <RegionLinksEditDialog
          key={`region-link-edit-${currentRegionLink.id}`}
          open={open === 'edit'}
          onOpenChange={handleEditOpenChange}
          currentRegionLink={currentRegionLink}
        />
      )}
    </>
  )
}
