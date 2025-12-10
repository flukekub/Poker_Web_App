import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getTablesByType, createTable } from "@/lib/api"

export function useTables(token?: string, type?: string) {
  return useQuery({
    queryKey: ["tables", type],
    queryFn: () => {
      if (!token) throw new Error("missing token")
      return getTablesByType(token, type)
    },
    enabled: !!token && !!type,
    staleTime: 30_000,
  })
}

export function useCreateTable(token: string, type: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      tableName: string
      description: string
      gameType: string
      maxPlayers: number
      minBuyIn: number
      maxBuyIn: number
    }) => createTable(token, payload.tableName, payload.description, payload.gameType, payload.maxPlayers, payload.minBuyIn, payload.maxBuyIn),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables", type] })
    },
  })
}