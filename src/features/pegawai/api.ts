import { csrfHeaders, request } from "@/lib/api"

import type {
  CreatePegawaiPayload,
  PaginatedResponse,
  Pegawai,
  PegawaiFilters,
  UpdatePegawaiPayload,
} from "@/features/pegawai/types"

type PegawaiResponse = {
  data: Pegawai
}

function buildQuery(filters: PegawaiFilters): string {
  const params = new URLSearchParams()

  if (filters.search?.trim()) {
    params.set("search", filters.search.trim())
  }

  if (filters.cursor) {
    params.set("cursor", filters.cursor)
  }

  const query = params.toString()

  return query ? `?${query}` : ""
}

export function fetchPegawaiList(
  filters: PegawaiFilters
): Promise<PaginatedResponse<Pegawai>> {
  return request<PaginatedResponse<Pegawai>>(
    `/api/pegawai${buildQuery(filters)}`
  )
}

export async function fetchPegawai(uuid: string): Promise<Pegawai> {
  const response = await request<PegawaiResponse>(`/api/pegawai/${uuid}`)

  return response.data
}

export async function createPegawai(
  payload: CreatePegawaiPayload
): Promise<Pegawai> {
  const headers = await csrfHeaders()

  const response = await request<PegawaiResponse>("/api/pegawai", {
    method: "POST",
    body: payload,
    headers,
  })

  return response.data
}

export async function updatePegawai(
  uuid: string,
  payload: UpdatePegawaiPayload
): Promise<Pegawai> {
  const headers = await csrfHeaders()

  const response = await request<PegawaiResponse>(`/api/pegawai/${uuid}`, {
    method: "PUT",
    body: payload,
    headers,
  })

  return response.data
}

export async function deletePegawai(uuid: string): Promise<void> {
  const headers = await csrfHeaders()

  await request<void>(`/api/pegawai/${uuid}`, {
    method: "DELETE",
    headers,
  })
}
