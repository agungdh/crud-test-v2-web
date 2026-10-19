import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import {
  createDiklat,
  deleteDiklat,
  fetchDiklat,
  fetchDiklatList,
  updateDiklat,
} from "@/features/diklat/api"
import type { DiklatFilters, DiklatPayload } from "@/features/diklat/types"

const diklatKeys = {
  all: ["diklat"] as const,
  lists: () => [...diklatKeys.all, "list"] as const,
  list: (filters: DiklatFilters) => [...diklatKeys.lists(), filters] as const,
  details: () => [...diklatKeys.all, "detail"] as const,
  detail: (uuid: string) => [...diklatKeys.details(), uuid] as const,
}

export function useDiklatList(filters: DiklatFilters) {
  return useQuery({
    queryKey: diklatKeys.list(filters),
    queryFn: () => fetchDiklatList(filters),
    placeholderData: keepPreviousData,
  })
}

export function useDiklat(uuid: string | null, enabled = true) {
  return useQuery({
    queryKey: diklatKeys.detail(uuid ?? ""),
    queryFn: () => fetchDiklat(uuid as string),
    enabled: Boolean(uuid) && enabled,
  })
}

export function useCreateDiklat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DiklatPayload) => createDiklat(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: diklatKeys.lists() })
    },
  })
}

export function useUpdateDiklat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: DiklatPayload }) =>
      updateDiklat(uuid, payload),
    onSuccess: (diklat) => {
      queryClient.setQueryData(diklatKeys.detail(diklat.uuid), diklat)
      void queryClient.invalidateQueries({ queryKey: diklatKeys.lists() })
    },
  })
}

export function useDeleteDiklat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (uuid: string) => deleteDiklat(uuid),
    onSuccess: (_data, uuid) => {
      queryClient.removeQueries({ queryKey: diklatKeys.detail(uuid) })
      void queryClient.invalidateQueries({ queryKey: diklatKeys.lists() })
    },
  })
}
