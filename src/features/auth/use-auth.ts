import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { fetchCurrentUser, login, logout } from "@/features/auth/api"

const currentUserQueryKey = ["auth", "current-user"] as const

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(currentUserQueryKey, user)
      // The login payload omits the pegawai profile; refresh it from /me.
      void queryClient.invalidateQueries({ queryKey: currentUserQueryKey })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.setQueryData(currentUserQueryKey, null)
    },
  })
}
