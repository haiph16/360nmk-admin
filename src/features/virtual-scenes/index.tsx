import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { VirtualScenesDialogs } from './components/virtual-scenes-dialogs'
import { VirtualScenesPrimaryButtons } from './components/virtual-scenes-primary-buttons'
import { VirtualScenesProvider } from './components/virtual-scenes-provider'
import { VirtualScenesTable } from './components/virtual-scenes-table'
import { useVirtualScenes } from './hooks/use-virtual-scenes'

const route = getRouteApi('/_authenticated/virtual-scenes/')

export function VirtualScenes() {
  const { t } = useTranslation()
  const search = route.useSearch()
  const routerNavigate = route.useNavigate()
  const page = (search as any)?.page ?? 1
  const pageSize = (search as any)?.pageSize ?? 10
  const {
    data: responseData,
    isLoading,
    isError,
  } = useVirtualScenes(page, pageSize)

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
    <VirtualScenesProvider>
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
              {t('virtual_scenes') || 'Virtual Scenes'}
            </h2>
            <p className='text-muted-foreground'>
              {t('virtual_scenes_desc') || 'Manage your virtual scenes'}
            </p>
          </div>
          <VirtualScenesPrimaryButtons />
        </div>

        {isLoading && <div>{t('loading')}</div>}
        {isError && <div>{t('error')}</div>}
        {!isLoading && !isError && (
          <VirtualScenesTable
            data={data}
            search={search}
            navigate={navigate}
            paginationMeta={paginationMeta}
          />
        )}
      </Main>

      <VirtualScenesDialogs />
    </VirtualScenesProvider>
  )
}
