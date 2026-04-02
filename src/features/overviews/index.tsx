import { useTranslation } from 'react-i18next'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { OverviewsDialogs } from './components/overviews-dialogs'
import { OverviewsProvider } from './components/overviews-provider'
import { OverviewsView } from './components/overviews-view'
import { useOverview } from './hooks/use-overviews'

export function Overviews() {
  const { t } = useTranslation()
  const { data, isLoading, isError } = useOverview()

  return (
    <OverviewsProvider>
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
              {t('overviews') || 'Overviews'}
            </h2>
            <p className='text-muted-foreground'>
              {t('manage_360_content') || 'Manage your 360° content'}
            </p>
          </div>
        </div>

        {isLoading && <div>{t('loading')}</div>}
        {isError && <div>{t('error')}</div>}
        {!isLoading && !isError && <OverviewsView overview={data ?? null} />}
      </Main>

      <OverviewsDialogs />
    </OverviewsProvider>
  )
}

export * from './hooks/use-overviews'
export * from './data/schema'
