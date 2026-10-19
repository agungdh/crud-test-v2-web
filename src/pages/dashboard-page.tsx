import { LogOutIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useCurrentUser, useLogout } from "@/features/auth/use-auth"

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()
  const logout = useLogout()

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate("/login", { replace: true })
      },
    })
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>You are signed in.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Name</span>
            <span className="font-medium">{user?.name}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <Button
            variant="outline"
            className="mt-2 w-full"
            disabled={logout.isPending}
            onClick={handleLogout}
          >
            {logout.isPending ? <Spinner /> : <LogOutIcon />}
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
