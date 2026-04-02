import { useTranslation } from 'react-i18next'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useOtherInfo } from '../hooks/use-other-info'
import { OtherInfoCard } from './card'
import { OtherInfoEditDialog } from './edit-dialog'
import { OtherInfoProvider } from './provider'

export function OtherInfoView() {
  const { t } = useTranslation()
  const { data, isLoading, isError } = useOtherInfo()

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
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            {t('other_info') || 'Other Info'}
          </h2>
          <p className='text-muted-foreground'>
            {t('manage_other_info') || 'Manage general information'}
          </p>
        </div>

        {isLoading && <div>{t('loading') || 'Loading...'}</div>}
        {isError && <div>{t('error') || 'Error loading data'}</div>}
        {!isLoading && !isError && (
          <OtherInfoProvider>
            <OtherInfoCard data={data || null} isLoading={isLoading} />
            <OtherInfoEditDialog data={data || null} />
          </OtherInfoProvider>
        )}
      </Main>
    </>
  )
}
