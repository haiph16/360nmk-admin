import { createFileRoute } from '@tanstack/react-router'
import { Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  component: () => (
    <Navigate to='/overviews' search={{ page: 1, pageSize: 10 }} />
  ),
})
