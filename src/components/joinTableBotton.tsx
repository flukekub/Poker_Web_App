"use client";
import { useTable } from "@/lib/tanstack/queryTable";
import PersonIcon from "@mui/icons-material/Person";
import { useSession } from "next-auth/react";
import { useWebSocket } from "@/providers/webSocketProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type JoinTableButtonProps = {
  tableId: number;
  maxPlayers: number;
  isActive: boolean;
  onJoin: (tableId: number) => void;
};

export default function JoinTableButton({
  tableId,
  maxPlayers,
  isActive,
  onJoin,
}: JoinTableButtonProps) {
  const { data: session } = useSession();
  const { data: tableData, isLoading: isTableLoading } = useTable(
    session?.accessToken,
    tableId
  );

  const stompClient = useWebSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!stompClient.client || !stompClient.isConnected)return;

    const subscription = stompClient.client.subscribe(
      "/topic/notifications",
      (message) => {
        const notification = JSON.parse(message.body);

        // Listen for TABLE{tableId}_JOINED and TABLE{tableId}_LEFT events
        if (notification.type) {
          const joinMatch = notification.type.match(/TABLE(\d+)_JOINED/);
          const leftMatch = notification.type.match(/TABLE(\d+)_LEFT/);

          if (joinMatch) {
            const notificationTableId = parseInt(joinMatch[1]);
            if (notificationTableId === tableId) {
              // Invalidate this specific table's query to refresh player count
              queryClient.invalidateQueries({ queryKey: ["table", tableId] });
            }
          } else if (leftMatch) {
            const notificationTableId = parseInt(leftMatch[1]);
            if (notificationTableId === tableId) {
              // Invalidate this specific table's query to refresh player count
              queryClient.invalidateQueries({ queryKey: ["table", tableId] });
            }
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [stompClient, tableId, queryClient]);


  return (
    <button
      className="px-4 py-2 bg-white text-primary font-bold rounded-3xl transition flex items-center justify-center gap-2 w-full md:w-auto cursor-pointer disabled:opacity-60 hover:bg-gray-100"
      disabled={!isActive || isTableLoading}
      onClick={() => onJoin(tableId)}
      suppressHydrationWarning={true}
    >
      {isTableLoading ? 0 : tableData?.currentPlayers}/{maxPlayers} players
      <PersonIcon fontSize="small" />
    </button>
  );
}
