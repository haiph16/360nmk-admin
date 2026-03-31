import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasPermission } from '@/lib/utils'
import { Overviews } from '@/features/overviews'

export const Route = createFileRoute('/_authenticated/overviews/')({
  beforeLoad: async () => {
    if (!hasPermission('overviews.view')) {
      throw redirect({ to: '/403' })
    }
  },
  component: Overviews,
})
