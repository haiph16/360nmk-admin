import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UtilitiesDialogs } from './components/utilities-dialogs'
import { UtilitiesPrimaryButtons } from './components/utilities-primary-buttons'
import { UtilitiesProvider } from './components/utilities-provider'
import { UtilitiesTable } from './components/utilities-table'
import { useUtilities } from './hooks/use-utilities'

const route = getRouteApi('/_authenticated/utilities/')

export function Utilities() {
  const { t } = useTranslation()
  const search = route.useSearch()
  const routerNavigate = route.useNavigate()
  const page = (search as any)?.page ?? 1
  const pageSize = (search as any)?.pageSize ?? 10
  const name = (search as any)?.name ?? ''

  const {
    data: responseData,
    isLoading,
    isError,
  } = useUtilities(page, pageSize, name)

  const data = Array.isArray(responseData)
    ? responseData
    : (responseData?.data ?? [])

  const paginationMeta = !Array.isArray(responseData)
    ? responseData?.pagination
    : undefined

  const navigate = useMemo(
    () =>
      (opts: {
        search:
          | true
          | Record<string, unknown>
          | ((prev: Record<string, unknown>) => Record<string, unknown>)
        replace?: boolean
      }) => {
        const nextSearch =
          typeof opts.search === 'function'
            ? opts.search(search as Record<string, unknown>)
            : opts.search === true
              ? search
              : opts.search

        routerNavigate({
          search: nextSearch as any,
          replace: opts.replace,
        })
      },
    [routerNavigate, search]
  )

  return (
    <UtilitiesProvider>
      <Header fixed>
        <Search />
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
              {t('utilities') || 'Utilities'}
            </h2>
            <p className='text-muted-foreground'>
              {t('utilities_desc') || 'Manage your utilities'}
            </p>
          </div>
          <UtilitiesPrimaryButtons />
        </div>

        {isLoading && <div>{t('loading')}</div>}
        {isError && <div>{t('error')}</div>}
        {!isLoading && !isError && (
          <UtilitiesTable
            data={data}
            search={search}
            navigate={navigate}
            paginationMeta={paginationMeta}
          />
        )}
      </Main>

      <UtilitiesDialogs />
    </UtilitiesProvider>
  )
}
