const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/+$/, "")

export type ValidationErrors = Record<string, string[]>

export class ApiError extends Error {
  readonly status: number
  readonly errors: ValidationErrors

  constructor(status: number, message: string, errors: ValidationErrors = {}) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.errors = errors
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
}

function readCookie(name: string): string | null {
  const prefix = `${name}=`
  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))

  if (!cookie) {
    return null
  }

  return decodeURIComponent(cookie.slice(prefix.length))
}

async function send(
  path: string,
  { body, headers, ...init }: RequestOptions = {}
): Promise<Response> {
  const requestHeaders = new Headers(headers)
  requestHeaders.set("Accept", "application/json")
  requestHeaders.set("X-Requested-With", "XMLHttpRequest")

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json")
  }

  return fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

export async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const response = await send(path, options)

  if (response.status === 204) {
    return undefined as T
  }

  const data: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const payload = data as {
      message?: string
      errors?: ValidationErrors
    } | null

    throw new ApiError(
      response.status,
      payload?.message ?? `Request failed with status ${response.status}.`,
      payload?.errors ?? {}
    )
  }

  return data as T
}

/**
 * Request a fresh CSRF cookie from Sanctum and return the header needed for
 * stateful (cookie based) mutating requests.
 */
export async function csrfHeaders(): Promise<Record<string, string>> {
  await request<void>("/sanctum/csrf-cookie")

  const token = readCookie("XSRF-TOKEN")

  return token ? { "X-XSRF-TOKEN": token } : {}
}
