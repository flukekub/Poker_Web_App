"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMe, updateChipsBalance } from "@/lib/api";
import { useSession } from "next-auth/react";

export function useMe() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: ["me", token],
    queryFn: () => {
      if (!token) throw new Error("No token provided");
      return getMe(token);
    },
    enabled: !!token,
    staleTime: 0, // Always fetch fresh data when invalidated
  });
}

export function useUpdateChips() {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const userId = session?.user?._id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      amount,
      operation,
    }: {
      amount: number;
      operation: "ADD" | "DEDUCT";
    }) => {
      if (!token) throw new Error("No token provided");
      if (!userId) throw new Error("No user ID provided");
      return updateChipsBalance(token, userId, amount, operation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
