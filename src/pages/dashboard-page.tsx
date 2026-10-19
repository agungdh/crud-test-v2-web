import {
  ActivityIcon,
  ArrowRightIcon,
  LogOutIcon,
  MailIcon,
  SettingsIcon,
  ShieldCheckIcon,
  UserIcon,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
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
  const firstName = user?.name.split(/\s+/).filter(Boolean)[0]

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate("/login", { replace: true })
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Selamat datang{firstName ? `, ${firstName}` : ""}
          </h2>
          <p className="text-sm text-muted-foreground">
            Ringkasan akun dan aktivitas Anda.
          </p>
        </div>
        <Button nativeButton={false} render={<Link to="/settings" />}>
          Buka pengaturan
          <ArrowRightIcon />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Nama</CardDescription>
            <CardAction>
              <UserIcon className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="truncate text-lg font-semibold">
              {user?.name ?? "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Email</CardDescription>
            <CardAction>
              <MailIcon className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="truncate text-lg font-semibold">
              {user?.email ?? "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Status akun</CardDescription>
            <CardAction>
              <ShieldCheckIcon className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <span className="text-lg font-semibold">Aktif</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Terverifikasi
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Aktivitas terbaru</CardTitle>
            <CardDescription>
              Riwayat aktivitas akun Anda akan tampil di sini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <ActivityIcon className="size-5" />
              </div>
              <div>
                <p className="font-medium">Belum ada aktivitas</p>
                <p className="text-sm text-muted-foreground">
                  Aktivitas akan muncul setelah Anda mulai menggunakan aplikasi.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Akses cepat</CardTitle>
            <CardDescription>Pintasan ke halaman penting.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              nativeButton={false}
              render={<Link to="/settings" />}
            >
              <SettingsIcon />
              Pengaturan akun
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              disabled={logout.isPending}
              onClick={handleLogout}
            >
              {logout.isPending ? <Spinner /> : <LogOutIcon />}
              Keluar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
