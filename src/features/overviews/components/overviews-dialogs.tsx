import { CompanyInfoEditDialog } from './company-info-edit-dialog'
import { OverviewsEditDialog } from './overviews-edit-dialog'
import { useOverviewsContext } from './overviews-provider'

export function OverviewsDialogs() {
  const {
    open,
    setOpen,
    currentOverview,
    setCurrentOverview,
    currentCompanyInfo,
    setCurrentCompanyInfo,
  } = useOverviewsContext()

  const handleEditOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(null)
      setTimeout(() => setCurrentOverview(null), 500)
    }
  }

  const handleCompanyInfoOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(null)
      setTimeout(() => setCurrentCompanyInfo(null), 500)
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
      {currentCompanyInfo && (
        <CompanyInfoEditDialog
          key={`company-info-edit-${currentCompanyInfo.id}`}
          open={open === 'edit-company'}
          onOpenChange={handleCompanyInfoOpenChange}
          currentCompanyInfo={currentCompanyInfo}
        />
      )}
    </>
  )
}
