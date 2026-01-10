import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTablePlayer, getTablePlayersByTableId } from "@/lib/api";

export function useCreateTablePlayer(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      userId: number;
      tableId: number;
      stax: number;
      seatNumber: number;
    }) =>
      createTablePlayer(
        token,
        payload.userId,
        payload.tableId,
        payload.stax,
        payload.seatNumber
      ),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tablePlayers", variables.tableId] });
    },
  });
}

export function useTablePlayer(token: string | undefined, tableId: number) {
  return useQuery({
    queryKey: ["tablePlayers", tableId],
    queryFn: () => {
      if (!token) throw new Error("missing token")
      return getTablePlayersByTableId(token, tableId);
    },
    enabled: !!token && !!tableId,
  });
}
