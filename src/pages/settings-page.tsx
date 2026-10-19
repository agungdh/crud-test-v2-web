import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCurrentUser } from "@/features/auth/use-auth"

const themeOptions = [
  { value: "light", label: "Terang", icon: SunIcon },
  { value: "dark", label: "Gelap", icon: MoonIcon },
  { value: "system", label: "Sistem", icon: MonitorIcon },
] as const

export function SettingsPage() {
  const { data: user } = useCurrentUser()
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex w-full max-w-4xl flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Pengaturan</h2>
        <p className="text-sm text-muted-foreground">
          Kelola informasi akun dan preferensi tampilan.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>
            Informasi akun yang sedang Anda gunakan.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Username / NIP
            </span>
            <span className="text-sm font-medium">{user?.username ?? "—"}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Email
            </span>
            <span className="text-sm font-medium">{user?.email ?? "—"}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              UUID pengguna
            </span>
            <span className="truncate text-sm font-medium">
              {user?.uuid ?? "—"}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Status
            </span>
            <span className="text-sm font-medium">Aktif</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tampilan</CardTitle>
          <CardDescription>
            Pilih tema yang paling nyaman untuk mata Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-3">
            {themeOptions.map((option) => {
              const Icon = option.icon
              const isActive = theme === option.value

              return (
                <Button
                  key={option.value}
                  variant={isActive ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setTheme(option.value)}
                >
                  <Icon />
                  {option.label}
                  {isActive ? <CheckIcon className="ml-auto" /> : null}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
