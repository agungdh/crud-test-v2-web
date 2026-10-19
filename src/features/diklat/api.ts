import { csrfHeaders, request, withMethodOverride } from "@/lib/api"

import type {
  Diklat,
  DiklatFilters,
  DiklatPayload,
  PaginatedResponse,
} from "@/features/diklat/types"

type DiklatResponse = {
  data: Diklat
}

function buildQuery(filters: DiklatFilters): string {
  const params = new URLSearchParams()

  if (filters.search?.trim()) {
    params.set("search", filters.search.trim())
  }

  if (filters.jenis_pelatihan_uuid) {
    params.set("jenis_pelatihan_uuid", filters.jenis_pelatihan_uuid)
  }

  if (filters.dari_tanggal) {
    params.set("dari_tanggal", filters.dari_tanggal)
  }

  if (filters.sampai_tanggal) {
    params.set("sampai_tanggal", filters.sampai_tanggal)
  }

  if (filters.page) {
    params.set("page", String(filters.page))
  }

  if (filters.per_page) {
    params.set("per_page", String(filters.per_page))
  }

  const query = params.toString()

  return query ? `?${query}` : ""
}

function toFormData(payload: DiklatPayload): FormData {
  const formData = new FormData()

  formData.set("jenis_pelatihan_uuid", payload.jenis_pelatihan_uuid)
  formData.set("nomor_surat", payload.nomor_surat)
  formData.set("materi_pengembangan", payload.materi_pengembangan)
  formData.set("dari_tanggal_pelaksanaan", payload.dari_tanggal_pelaksanaan)
  formData.set("sampai_tanggal_pelaksanaan", payload.sampai_tanggal_pelaksanaan)
  formData.set("jumlah_jam_pelatihan", String(payload.jumlah_jam_pelatihan))

  if (payload.berkas instanceof File) {
    formData.set("berkas", payload.berkas)
  } else if (payload.berkas === null) {
    // An empty value is converted to null by the API and clears the attachment.
    formData.set("berkas", "")
  }

  return formData
}

export function fetchDiklatList(
  filters: DiklatFilters
): Promise<PaginatedResponse<Diklat>> {
  return request<PaginatedResponse<Diklat>>(`/api/diklat${buildQuery(filters)}`)
}

export async function fetchDiklat(uuid: string): Promise<Diklat> {
  const response = await request<DiklatResponse>(`/api/diklat/${uuid}`)

  return response.data
}

export async function createDiklat(payload: DiklatPayload): Promise<Diklat> {
  const headers = await csrfHeaders()

  const response = await request<DiklatResponse>("/api/diklat", {
    method: "POST",
    body: toFormData(payload),
    headers,
  })

  return response.data
}

export async function updateDiklat(
  uuid: string,
  payload: DiklatPayload
): Promise<Diklat> {
  const headers = await csrfHeaders()

  const response = await request<DiklatResponse>(`/api/diklat/${uuid}`, {
    // Multipart uploads must travel as POST with the `_method` override.
    method: "POST",
    body: withMethodOverride(toFormData(payload), "PUT"),
    headers,
  })

  return response.data
}

export async function deleteDiklat(uuid: string): Promise<void> {
  const headers = await csrfHeaders()

  await request<void>(`/api/diklat/${uuid}`, {
    method: "DELETE",
    headers,
  })
}
