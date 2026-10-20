import { csrfHeaders, request } from "@/lib/api"

import type {
  JenisPelatihan,
  JenisPelatihanFilters,
  JenisPelatihanPayload,
  PaginatedResponse,
} from "@/features/jenis-pelatihan/types"

type JenisPelatihanResponse = {
  data: JenisPelatihan
}

function buildQuery(filters: JenisPelatihanFilters): string {
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

export function fetchJenisPelatihanList(
  filters: JenisPelatihanFilters
): Promise<PaginatedResponse<JenisPelatihan>> {
  return request<PaginatedResponse<JenisPelatihan>>(
    `/api/jenis-pelatihan${buildQuery(filters)}`
  )
}

export async function fetchJenisPelatihan(
  uuid: string
): Promise<JenisPelatihan> {
  const response = await request<JenisPelatihanResponse>(
    `/api/jenis-pelatihan/${uuid}`
  )

  return response.data
}

/**
 * Fetch every jenis pelatihan by following `meta.next_cursor`.
 *
 * The API fixes the page size at 20 and does not expose a total count, so the
 * diklat form has to walk the pages to build a complete select.
 */
export async function fetchAllJenisPelatihan(): Promise<JenisPelatihan[]> {
  const items: JenisPelatihan[] = []
  let cursor: string | undefined

  do {
    const response = await fetchJenisPelatihanList({ cursor })

    items.push(...response.data)
    cursor = response.meta.next_cursor ?? undefined
  } while (cursor)

  return items
}

export async function createJenisPelatihan(
  payload: JenisPelatihanPayload
): Promise<JenisPelatihan> {
  const headers = await csrfHeaders()

  const response = await request<JenisPelatihanResponse>(
    "/api/jenis-pelatihan",
    {
      method: "POST",
      body: payload,
      headers,
    }
  )

  return response.data
}

export async function updateJenisPelatihan(
  uuid: string,
  payload: JenisPelatihanPayload
): Promise<JenisPelatihan> {
  const headers = await csrfHeaders()

  const response = await request<JenisPelatihanResponse>(
    `/api/jenis-pelatihan/${uuid}`,
    {
      method: "PUT",
      body: payload,
      headers,
    }
  )

  return response.data
}

export async function deleteJenisPelatihan(uuid: string): Promise<void> {
  const headers = await csrfHeaders()

  await request<void>(`/api/jenis-pelatihan/${uuid}`, {
    method: "DELETE",
    headers,
  })
}
