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

export type { PaginatedResponse } from "@/lib/pagination"

export type PegawaiFilters = {
  search?: string
  cursor?: string
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
