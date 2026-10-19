import { CircleAlertIcon, LogInIcon } from "lucide-react"
import { useState, type FormEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { useLogin } from "@/features/auth/use-auth"
import { ApiError } from "@/lib/api"

type LocationState = {
  from?: {
    pathname?: string
  }
}

function getErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return "Unable to reach the server. Make sure the API is running and CORS is configured."
  }

  if (error.status === 429) {
    return "Too many login attempts. Please wait a minute and try again."
  }

  return error.errors.login?.[0] ?? error.errors.password?.[0] ?? error.message
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useLogin()

  const [loginValue, setLoginValue] = useState("")
  const [password, setPassword] = useState("")

  const fieldErrors = login.error instanceof ApiError ? login.error.errors : {}
  const hasFieldErrors = Boolean(
    fieldErrors.login?.length || fieldErrors.password?.length
  )
  const errorMessage =
    login.error && !hasFieldErrors ? getErrorMessage(login.error) : null

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const from = (location.state as LocationState | null)?.from?.pathname ?? "/"

    login.mutate(
      { login: loginValue, password },
      {
        onSuccess: () => {
          navigate(from, { replace: true })
        },
      }
    )
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            {errorMessage ? (
              <Alert variant="destructive">
                <CircleAlertIcon />
                <AlertTitle>Login failed</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="login">Email atau NIP</Label>
              <Input
                id="login"
                type="text"
                autoComplete="username"
                autoFocus
                required
                value={loginValue}
                onChange={(event) => setLoginValue(event.target.value)}
                aria-invalid={Boolean(fieldErrors.login)}
              />
              {fieldErrors.login?.[0] ? (
                <p className="text-xs text-destructive">
                  {fieldErrors.login[0]}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(fieldErrors.password)}
              />
              {fieldErrors.password?.[0] ? (
                <p className="text-xs text-destructive">
                  {fieldErrors.password[0]}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              className="mt-2 w-full"
              disabled={login.isPending}
            >
              {login.isPending ? <Spinner /> : <LogInIcon />}
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
