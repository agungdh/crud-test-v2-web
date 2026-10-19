import { Navigate, Outlet, useLocation } from "react-router-dom"

import { FullPageLoader } from "@/components/full-page-loader"
import { useCurrentUser } from "@/features/auth/use-auth"

export function ProtectedRoute() {
  const location = useLocation()
  const { data: user, isPending } = useCurrentUser()

  if (isPending) {
    return <FullPageLoader />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
