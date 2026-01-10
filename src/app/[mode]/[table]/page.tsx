"use client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { use, useEffect } from "react";
import { SEAT_POSITIONS } from "@/constant/player";
import { PlayerSeat } from "@/components/table";
import Navbar from "@/components/ui/navbar";
import { useTablePlayer } from "@/lib/tanstack/queryTablePlayer";
import { useSession } from "next-auth/react";
import { useWebSocket } from "@/providers/webSocketProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useTable } from "@/lib/tanstack/queryTable";

export default function Table({
  params: paramsPromise,
}: {
  params: Promise<{ mode: string; table: number }>;
}) {
  const params = use(paramsPromise);
  const tableId = params.table;
  const { data: session } = useSession();
  const { data: tablePlayers, isLoading: isPlayersLoading } = useTablePlayer(
    session?.accessToken,
    tableId
  );
  const { data: tableData, isLoading: isTableLoading } = useTable(
    session?.accessToken,
    tableId
  );

  const queryClient = useQueryClient();
  const stompClient = useWebSocket();

  useEffect(() => {
    if (!stompClient.client || !stompClient.isConnected) return;

    console.log("Subscribing to table updates...");

    const subscription = stompClient.client.subscribe(
      "/topic/notifications",
      (message) => {
        const notification = JSON.parse(message.body);
        console.log("Received notification:", notification);

        if (notification.type === `TABLE${tableId}_JOINED`) {
          console.log(notification.content);
          queryClient.invalidateQueries({
            queryKey: ["tablePlayers", tableId],
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [stompClient, queryClient, tableId]);

  const getPlayerAtSeat = (seatIndex: number) => {
    if (!tablePlayers || !Array.isArray(tablePlayers)) return null;
    return tablePlayers.find((p) => p.seatNumber === seatIndex);
  };

  if (!tableData || isPlayersLoading || isTableLoading) {
    return <div>Loading table...</div>; 
  }
  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <div className="w-full absolute top-0 z-40">
        <Navbar />
      </div>
      {/* Header / Navigation */}
      <div className="w-full p-4 absolute top-0 left-0 z-50 pointer-events-none">
        <Link
          href={`/${params.mode}`}
          className="inline-flex items-center gap-2 bg-surface-panel hover:bg-brand-accent text-white rounded-full p-2 px-4 shadow-md transition-colors pointer-events-auto"
          aria-label="Back"
        >
          <ArrowBackIcon />
          <span className="hidden sm:inline">Back</span>
        </Link>
      </div>

      {/* Poker Table Container */}
      <div className="flex-1 flex items-center justify-center w-full overflow-hidden py-20">
        <div className="relative w-[95vw] h-[500px] sm:w-[700px] sm:h-[450px] lg:w-[900px] lg:h-[500px]">
          {/* Table Surface */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[500px] sm:w-[600px] sm:h-[350px] lg:w-[800px] lg:h-[400px] rounded-[45%/40%] bg-primary-black border-4 border-[#236C6B] shadow-2xl">
            {/* Optional: Add table logo or community cards area here */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <span className="text-4xl font-bold text-[#236C6B]">POKER</span>
            </div>
          </div>

          {/* Render Seats */}
          {SEAT_POSITIONS.map((seat, idx) => {
            const player = getPlayerAtSeat(idx);
            return (
              <PlayerSeat
                key={seat.id}
                positionTrue={seat.positionTrue}
                positionFalse={seat.positionFalse}
                avatarSrc={
                  player?.profileImageUrl || "https://github.com/shadcn.png"
                }
                playerName={player?.username || seat.defaultName}
                balance={player ? `${player.stax} $` : seat.defaultBalance}
                isOccupied={!!player}
                seatNumber={idx}
                tableIdProp={tableId}
                mode={params.mode}
                minBuyIn={tableData.minBuyIn}
                maxBuyIn={tableData.maxBuyIn}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
