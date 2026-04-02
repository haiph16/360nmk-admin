import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasPermission } from '@/lib/utils'
import { ApartmentInteriorsView } from '@/features/apartment-interiors'

export const Route = createFileRoute('/_authenticated/apartment-interiors/')({
  beforeLoad: async () => {
    if (!hasPermission('apartment-interiors.view')) {
      throw redirect({ to: '/sign-in' })
    }
  },
  component: ApartmentInteriorsView,
})
