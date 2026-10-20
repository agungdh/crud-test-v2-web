import type { PaginatedResponse } from "@/lib/pagination"

export type { PaginatedResponse }

export type JenisPelatihan = {
  uuid: string
  jenis_pelatihan: string
}

export type JenisPelatihanFilters = {
  search?: string
  cursor?: string
}

export type JenisPelatihanPayload = {
  jenis_pelatihan: string
}
