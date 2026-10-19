import type { Pegawai } from "@/features/pegawai/types"

export type User = {
  uuid: string
  email: string | null
  username: string | null
  /**
   * Present on `/api/me`. The login response omits it until the profile is
   * refetched, so treat `undefined` as "not known yet".
   */
  pegawai?: Pegawai | null
}

export type LoginCredentials = {
  login: string
  password: string
}

export type LoginResponse = {
  user: User
}

export type CurrentUserResponse = {
  data: User
}
