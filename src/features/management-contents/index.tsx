import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ManagementContentsDialogs } from './components/management-contents-dialogs'
import { ManagementContentsPrimaryButtons } from './components/management-contents-primary-buttons'
import { ManagementContentsProvider } from './components/management-contents-provider'
import { ManagementContentsTable } from './components/management-contents-table'
import { useManagementContentsList } from './hooks/use-management-contents'

const route = getRouteApi('/_authenticated/management-contents/')

export function ManagementContents() {
  const { t } = useTranslation()
  const search = route.useSearch()
  const routerNavigate = route.useNavigate()
  const { data, isLoading, isError } = useManagementContentsList()

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
    <ManagementContentsProvider>
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
              {t('management_contents') || 'Management Contents'}
            </h2>
            <p className='text-muted-foreground'>
              {t('management_contents_desc') ||
                'Manage your management contents'}
            </p>
          </div>
          <ManagementContentsPrimaryButtons />
        </div>

        {isLoading && <div>{t('loading')}</div>}
        {isError && <div>{t('error')}</div>}
        {!isLoading && !isError && (
          <ManagementContentsTable
            data={data ?? []}
            search={search}
            navigate={navigate}
          />
        )}
      </Main>

      <ManagementContentsDialogs />
    </ManagementContentsProvider>
  )
}
