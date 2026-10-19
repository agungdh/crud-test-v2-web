export type User = {
  uuid: string
  email: string | null
  username: string | null
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
