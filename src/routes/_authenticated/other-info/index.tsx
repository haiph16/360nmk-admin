import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasPermission } from '@/lib/utils'
import { OtherInfoView } from '@/features/other-info'

export const Route = createFileRoute('/_authenticated/other-info/')({
  beforeLoad: async () => {
    if (!hasPermission('other-info.view')) {
      throw redirect({ to: '/sign-in' })
    }
  },
  component: OtherInfoView,
})
