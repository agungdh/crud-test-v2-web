import { Navigate, Outlet } from "react-router-dom"

import { FullPageLoader } from "@/components/full-page-loader"
import { useCurrentUser } from "@/features/auth/use-auth"

export function GuestRoute() {
  const { data: user, isPending } = useCurrentUser()

  if (isPending) {
    return <FullPageLoader />
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
