import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import {
  createPegawai,
  deletePegawai,
  fetchPegawai,
  fetchPegawaiList,
  updatePegawai,
} from "@/features/pegawai/api"
import type {
  CreatePegawaiPayload,
  PegawaiFilters,
  UpdatePegawaiPayload,
} from "@/features/pegawai/types"

const pegawaiKeys = {
  all: ["pegawai"] as const,
  lists: () => [...pegawaiKeys.all, "list"] as const,
  list: (filters: PegawaiFilters) => [...pegawaiKeys.lists(), filters] as const,
  details: () => [...pegawaiKeys.all, "detail"] as const,
  detail: (uuid: string) => [...pegawaiKeys.details(), uuid] as const,
}

export function usePegawaiList(filters: PegawaiFilters) {
  return useQuery({
    queryKey: pegawaiKeys.list(filters),
    queryFn: () => fetchPegawaiList(filters),
    placeholderData: keepPreviousData,
  })
}

export function usePegawai(uuid: string | null, enabled = true) {
  return useQuery({
    queryKey: pegawaiKeys.detail(uuid ?? ""),
    queryFn: () => fetchPegawai(uuid as string),
    enabled: Boolean(uuid) && enabled,
  })
}

export function useCreatePegawai() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePegawaiPayload) => createPegawai(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: pegawaiKeys.lists() })
    },
  })
}

export function useUpdatePegawai() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      uuid,
      payload,
    }: {
      uuid: string
      payload: UpdatePegawaiPayload
    }) => updatePegawai(uuid, payload),
    onSuccess: (pegawai) => {
      queryClient.setQueryData(pegawaiKeys.detail(pegawai.uuid), pegawai)
      void queryClient.invalidateQueries({ queryKey: pegawaiKeys.lists() })
    },
  })
}

export function useDeletePegawai() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (uuid: string) => deletePegawai(uuid),
    onSuccess: (_data, uuid) => {
      queryClient.removeQueries({ queryKey: pegawaiKeys.detail(uuid) })
      void queryClient.invalidateQueries({ queryKey: pegawaiKeys.lists() })
    },
  })
}
