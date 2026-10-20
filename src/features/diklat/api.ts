import { uploadBerkas } from "@/features/berkas/api"
import { csrfHeaders, request } from "@/lib/api"

import type {
  Diklat,
  DiklatFilters,
  DiklatPayload,
  PaginatedResponse,
} from "@/features/diklat/types"

type DiklatResponse = {
  data: Diklat
}

type DiklatBody = Omit<DiklatPayload, "berkas"> & {
  berkas_path?: string | null
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

  if (filters.cursor) {
    params.set("cursor", filters.cursor)
  }

  const query = params.toString()

  return query ? `?${query}` : ""
}

/**
 * Upload a new attachment when one was selected.
 *
 * `undefined` keeps the stored file, a `File` replaces it, and `null` removes
 * it. The API expects the temporary `berkas_path` from the presigned upload,
 * never a multipart file part.
 */
async function toRequestBody(
  payload: DiklatPayload,
  replacesBerkas: boolean
): Promise<DiklatBody> {
  const { berkas, ...fields } = payload

  if (berkas instanceof File) {
    return { ...fields, berkas_path: await uploadBerkas(berkas) }
  }

  if (replacesBerkas && berkas === null) {
    return { ...fields, berkas_path: null }
  }

  return fields
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
  const body = await toRequestBody(payload, false)
  const headers = await csrfHeaders()

  const response = await request<DiklatResponse>("/api/diklat", {
    method: "POST",
    body,
    headers,
  })

  return response.data
}

export async function updateDiklat(
  uuid: string,
  payload: DiklatPayload
): Promise<Diklat> {
  const body = await toRequestBody(payload, true)
  const headers = await csrfHeaders()

  const response = await request<DiklatResponse>(`/api/diklat/${uuid}`, {
    method: "PUT",
    body,
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
