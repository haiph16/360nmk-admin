import { OverviewsEditDialog } from './overviews-edit-dialog'
import { useOverviewsContext } from './overviews-provider'

export function OverviewsDialogs() {
  const { open, setOpen, currentOverview, setCurrentOverview } =
    useOverviewsContext()

  const handleEditOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(null)
      setTimeout(() => setCurrentOverview(null), 500)
    }
  }

  return (
    <>
      {currentOverview && (
        <OverviewsEditDialog
          key={`overview-edit-${currentOverview.id}`}
          open={open === 'edit'}
          onOpenChange={handleEditOpenChange}
          currentOverview={currentOverview}
        />
      )}
    </>
  )
}
