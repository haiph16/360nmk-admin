import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { useUtilityPremises } from '../hooks/use-utility-premises'
import { UtilityPremisesDialogs } from './utility-premises-dialogs'
import { UtilityPremisesPrimaryButtons } from './utility-premises-primary-buttons'
import {
  UtilityPremisesProvider,
  useUtilityPremisesContext,
} from './utility-premises-provider'
import { UtilityPremisesTable } from './utility-premises-table'

function UtilityPremisesView() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [search, setSearch] = useState('')

  const { data, isLoading, isError, error } = useUtilityPremises(
    page,
    pageSize,
    search
  )

  const { setOpen, setCurrentPremise, setParentId } =
    useUtilityPremisesContext()

  const handleEdit = (premise: any) => {
    setCurrentPremise(premise)
    setOpen('edit')
  }

  const handleDelete = (premise: any) => {
    setCurrentPremise(premise)
    setOpen('delete')
  }

  const handleAddChild = (parentId: number) => {
    setParentId(parentId)
    setOpen('create')
  }

  const premises = data?.data?.data || []
  const meta = data?.data?.meta || { total: 0, page: 1, lastPage: 1, limit: 10 }

  return (
    <>
      <Header fixed>
        <div className='flex flex-1 items-center gap-4'>
          <Input
            placeholder={t('search_premises') || 'Search premises...'}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className='max-w-sm'
          />
        </div>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {t('utility_premises') || 'Utility Premises'}
            </h2>
            <p className='text-muted-foreground'>
              {t('manage_utility_premises') ||
                'Manage your utility premises hierarchy'}
            </p>
          </div>
          <UtilityPremisesPrimaryButtons />
        </div>

        {isLoading && (
          <div className='rounded-lg border border-dashed p-8 text-center'>
            <p className='text-muted-foreground'>
              {t('loading') || 'Loading...'}
            </p>
          </div>
        )}
        {isError && (
          <div className='rounded-lg border border-destructive/50 bg-destructive/10 p-4'>
            <p className='text-destructive'>
              {t('error') || 'Error'}: {error?.message || 'Unknown error'}
            </p>
          </div>
        )}
        {!isLoading && !isError && (
          <>
            <UtilityPremisesTable
              data={premises}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddChild={handleAddChild}
              paginationMeta={{
                page: meta.page,
                limit: meta.limit,
                total: meta.total,
                totalPages: meta.lastPage,
              }}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </>
        )}
      </Main>

      <UtilityPremisesDialogs currentPremise={null} parentId={null} />
    </>
  )
}

export function UtilityPremises() {
  return (
    <UtilityPremisesProvider>
      <UtilityPremisesView />
    </UtilityPremisesProvider>
  )
}
