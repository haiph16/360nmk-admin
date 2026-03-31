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
import { useOverviewsList, useCompanyInfo } from './hooks/use-overviews'

export function Overviews() {
  const { t } = useTranslation()
  const { data, isLoading, isError } = useOverviewsList()
  const {
    data: companyInfo,
    isLoading: isLoadingCompanyInfo,
    isError: isErrorCompanyInfo,
  } = useCompanyInfo()

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
              {t('overviews_desc') || 'Manage your overview content'}
            </p>
          </div>
        </div>

        {(isLoading || isLoadingCompanyInfo) && <div>{t('loading')}</div>}
        {(isError || isErrorCompanyInfo) && <div>{t('error')}</div>}
        {!isLoading &&
          !isError &&
          !isLoadingCompanyInfo &&
          !isErrorCompanyInfo && (
            <OverviewsView
              overview={data ?? null}
              companyInfo={companyInfo ?? null}
            />
          )}
      </Main>

      <OverviewsDialogs />
    </OverviewsProvider>
  )
}
