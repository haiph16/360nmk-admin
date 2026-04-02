import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useTypicalLayouts } from '../hooks/use-typical-layouts'
import { TypicalLayoutsDialogs } from './typical-layouts-dialogs'
import { TypicalLayoutsPrimaryButtons } from './typical-layouts-primary-buttons'
import { TypicalLayoutsProvider } from './typical-layouts-provider'
import { TypicalLayoutsTable } from './typical-layouts-table'

const route = getRouteApi('/_authenticated/typical-layouts/')

function TypicalLayoutsView() {
  const { t } = useTranslation()
  const search = route.useSearch()
  const routerNavigate = route.useNavigate()
  const page = (search as any)?.page ?? 1
  const pageSize = (search as any)?.pageSize ?? 10

  const {
    data: responseData,
    isLoading,
    isError,
  } = useTypicalLayouts(page, pageSize)

  const data = responseData?.data?.data ?? []
  const paginationMeta = responseData?.data?.meta
    ? {
        page: responseData.data.meta.page,
        limit: responseData.data.meta.limit,
        total: responseData.data.meta.total,
        totalPages: responseData.data.meta.lastPage,
      }
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
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {t('typical_layouts') || 'Typical Layouts'}
            </h2>
            <p className='text-muted-foreground'>
              {t('typical_layouts_desc') || 'Manage typical layouts'}
            </p>
          </div>
          <TypicalLayoutsPrimaryButtons />
        </div>

        {isLoading && <div>{t('loading') || 'Loading...'}</div>}
        {isError && <div>{t('error') || 'Error'}</div>}
        {!isLoading && !isError && (
          <TypicalLayoutsTable
            data={data}
            search={search as any}
            navigate={navigate as any}
            paginationMeta={paginationMeta}
          />
        )}
      </Main>

      <TypicalLayoutsDialogs />
    </>
  )
}

export function TypicalLayouts() {
  return (
    <TypicalLayoutsProvider>
      <TypicalLayoutsView />
    </TypicalLayoutsProvider>
  )
}
