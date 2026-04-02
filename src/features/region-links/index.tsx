import { useTranslation } from 'react-i18next'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RegionLinksDialogs } from './components/region-links-dialogs'
import { RegionLinksPrimaryButtons } from './components/region-links-primary-buttons'
import { RegionLinksProvider } from './components/region-links-provider'
import { RegionLinksTable } from './components/region-links-table'
import { useRegionLink } from './hooks/use-region-links'

export function RegionLinks() {
  const { t } = useTranslation()
  const { data, isLoading, isError, error } = useRegionLink()

  console.log(
    'RegionLinks - loading:',
    isLoading,
    'error:',
    error,
    'data:',
    data
  )

  return (
    <RegionLinksProvider>
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
              {t('region_links') || 'Region Links'}
            </h2>
            <p className='text-muted-foreground'>
              {t('manage_region_link_map') || 'Manage your region link map'}
            </p>
          </div>
          <RegionLinksPrimaryButtons />
        </div>

        {isLoading && (
          <div className='rounded-lg border border-dashed p-8 text-center'>
            <p className='text-muted-foreground'>{t('loading')}</p>
          </div>
        )}
        {isError && (
          <div className='rounded-lg border border-destructive/50 bg-destructive/10 p-4'>
            <p className='text-destructive'>
              {t('error')}: {error?.message || 'Unknown error'}
            </p>
          </div>
        )}
        {!isLoading && !isError && <RegionLinksTable data={data ?? null} />}
      </Main>

      <RegionLinksDialogs />
    </RegionLinksProvider>
  )
}

export * from './hooks/use-region-links'
export * from './data/schema'
