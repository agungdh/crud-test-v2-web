import { ApiError, csrfHeaders, request } from "@/lib/api"

import type {
  CurrentUserResponse,
  LoginCredentials,
  LoginResponse,
  User,
} from "@/features/auth/types"

export async function login(credentials: LoginCredentials): Promise<User> {
  const headers = await csrfHeaders()

  const response = await request<LoginResponse>("/api/login", {
    method: "POST",
    body: credentials,
    headers,
  })

  return response.user
}

export async function logout(): Promise<void> {
  const headers = await csrfHeaders()

  await request<{ message: string }>("/api/logout", {
    method: "POST",
    headers,
  })
}

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const response = await request<CurrentUserResponse>("/api/me")

    return response.data
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null
    }

    throw error
  }
}
