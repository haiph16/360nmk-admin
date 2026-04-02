import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useApartmentInteriors } from '../hooks/use-apartment-interiors'
import { ApartmentInteriorsDialogs } from './dialogs'
import { ApartmentInteriorsPrimaryButtons } from './primary-buttons'
import { ApartmentInteriorsProvider } from './provider'
import { ApartmentInteriorsTable } from './table'

const PAGE_SIZE = 10

export function ApartmentInteriorsView() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useApartmentInteriors(page, PAGE_SIZE)

  const paginationMeta = data?.data?.meta
    ? {
        page: data.data.meta.page,
        limit: data.data.meta.limit,
        total: data.data.meta.total,
        totalPages: data.data.meta.totalPages,
      }
    : undefined

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <ApartmentInteriorsProvider>
          <div className='flex flex-wrap items-end justify-between gap-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                {t('apartment_interiors') || 'Apartment Interiors'}
              </h2>
              <p className='text-muted-foreground'>
                {t('manage_apartment_interiors') ||
                  'Manage your apartment interiors'}
              </p>
            </div>
            <ApartmentInteriorsPrimaryButtons />
          </div>

          {isLoading && <div>{t('loading') || 'Loading...'}</div>}
          {isError && <div>{t('error') || 'Error'}</div>}
          {!isLoading && !isError && (
            <>
              <ApartmentInteriorsTable
                data={data?.data?.data || []}
                paginationMeta={paginationMeta}
                onPageChange={setPage}
              />
              <ApartmentInteriorsDialogs />
            </>
          )}
        </ApartmentInteriorsProvider>
      </Main>
    </>
  )
}
