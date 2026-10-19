export type User = {
  id: number
  name: string
  email: string
}

export type LoginCredentials = {
  email: string
  password: string
}

export type LoginResponse = {
  user: User
}

export type CurrentUserResponse = {
  data: User
}
