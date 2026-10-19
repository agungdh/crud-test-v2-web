import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import {
  createJenisPelatihan,
  deleteJenisPelatihan,
  fetchJenisPelatihan,
  fetchJenisPelatihanList,
  updateJenisPelatihan,
} from "@/features/jenis-pelatihan/api"
import type {
  JenisPelatihanFilters,
  JenisPelatihanPayload,
} from "@/features/jenis-pelatihan/types"

const jenisPelatihanKeys = {
  all: ["jenis-pelatihan"] as const,
  lists: () => [...jenisPelatihanKeys.all, "list"] as const,
  list: (filters: JenisPelatihanFilters) =>
    [...jenisPelatihanKeys.lists(), filters] as const,
  details: () => [...jenisPelatihanKeys.all, "detail"] as const,
  detail: (uuid: string) => [...jenisPelatihanKeys.details(), uuid] as const,
}

/** Every jenis pelatihan, used to fill the diklat form select. */
const optionsFilters: JenisPelatihanFilters = { per_page: 100 }

export function useJenisPelatihanList(filters: JenisPelatihanFilters) {
  return useQuery({
    queryKey: jenisPelatihanKeys.list(filters),
    queryFn: () => fetchJenisPelatihanList(filters),
    placeholderData: keepPreviousData,
  })
}

export function useJenisPelatihanOptions() {
  return useQuery({
    queryKey: jenisPelatihanKeys.list(optionsFilters),
    queryFn: () => fetchJenisPelatihanList(optionsFilters),
    staleTime: 5 * 60 * 1000,
    select: (response) => response.data,
  })
}

export function useJenisPelatihan(uuid: string | null, enabled = true) {
  return useQuery({
    queryKey: jenisPelatihanKeys.detail(uuid ?? ""),
    queryFn: () => fetchJenisPelatihan(uuid as string),
    enabled: Boolean(uuid) && enabled,
  })
}

export function useCreateJenisPelatihan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: JenisPelatihanPayload) =>
      createJenisPelatihan(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: jenisPelatihanKeys.lists(),
      })
    },
  })
}

export function useUpdateJenisPelatihan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      uuid,
      payload,
    }: {
      uuid: string
      payload: JenisPelatihanPayload
    }) => updateJenisPelatihan(uuid, payload),
    onSuccess: (jenisPelatihan) => {
      queryClient.setQueryData(
        jenisPelatihanKeys.detail(jenisPelatihan.uuid),
        jenisPelatihan
      )
      void queryClient.invalidateQueries({
        queryKey: jenisPelatihanKeys.lists(),
      })
    },
  })
}

export function useDeleteJenisPelatihan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (uuid: string) => deleteJenisPelatihan(uuid),
    onSuccess: (_data, uuid) => {
      queryClient.removeQueries({ queryKey: jenisPelatihanKeys.detail(uuid) })
      void queryClient.invalidateQueries({
        queryKey: jenisPelatihanKeys.lists(),
      })
    },
  })
}
