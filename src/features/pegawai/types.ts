export type Gender = "male" | "female"

export type PegawaiUser = {
  uuid: string
  email: string | null
  username: string | null
}

export type Pegawai = {
  uuid: string
  nip: string
  nama: string
  tanggal_lahir: string | null
  jabatan: string | null
  bidang: string | null
  gender: Gender | null
  tmt: string | null
  user_uuid: string
  user?: PegawaiUser
}

export type PaginationLink = {
  url: string | null
  label: string
  active: boolean
}

export type PaginationMeta = {
  current_page: number
  from: number | null
  last_page: number
  links: PaginationLink[]
  path: string
  per_page: number
  to: number | null
  total: number
}

export type PaginatedResponse<T> = {
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: PaginationMeta
}

export type PegawaiFilters = {
  search?: string
  page?: number
  per_page?: number
}

export type UpdatePegawaiPayload = {
  email: string | null
  password?: string
  nip: string
  nama: string
  tanggal_lahir: string | null
  jabatan: string | null
  bidang: string | null
  gender: Gender | null
  tmt: string | null
}

export type CreatePegawaiPayload = Omit<UpdatePegawaiPayload, "password"> & {
  password: string
}
