"use client";

import { use, useEffect } from "react";
import { INGAME_PLAYER_POSITIONS } from "@/constant/player";
import { PlayerIngameSeat } from "@/components/playerIngameSeat";
import { useTablePlayer } from "@/lib/tanstack/queryTablePlayer";
import { useSession } from "next-auth/react";
import { useTable } from "@/lib/tanstack/queryTable";
import BottomPanel from "@/components/section/inGame/bottomPanel";
import { TablePlayer } from "@/types/requestBodys";
import { getRotatedSeatIndex } from "@/lib/utils/gameUtils";
import { useInGameLogic } from "@/hooks/useInGameLogic";
import { HeadPanel } from "@/components/section/inGame/headPanel";

export default function InGamePage({
  params: paramsPromise,
}: {
  params: Promise<{ mode: string; table: number; gameTable: number }>;
}) {
  const params = use(paramsPromise);
  const { data: session } = useSession();
  const { data: tablePlayers, isLoading: isPlayersLoading } = useTablePlayer(
    session?.accessToken,
    params.table,
  );
  const { data: tableData, isLoading: isTableLoading } = useTable(
    session?.accessToken,
    params.table,
  );
  const { startGame } = useInGameLogic(
    Number(params.table),
    Number(params.gameTable),
  );

  const currentUser = tablePlayers?.find(
    (p: TablePlayer) => p.userId === Number(session?.user?._id),
  );


  if (!tableData || isPlayersLoading || isTableLoading || !currentUser) {
    return <div>Loading table...</div>;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <HeadPanel
        gameMode={params.mode}
        tablePlayerId={currentUser.tablePlayerId}
        token={session?.accessToken}
      />
      <div className="flex-1 flex items-center justify-center w-full overflow-hidden py-20">
        <div className="relative w-[95vw] h-[500px] sm:w-[700px] sm:h-[450px] lg:w-[900px] lg:h-[500px]">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[500px] sm:w-[600px] sm:h-[350px] lg:w-[800px] lg:h-[400px] rounded-[45%/40%] bg-primary-black border-4 border-[#236C6B] shadow-2xl">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    startGame(0, tableData.bigBlind, tableData.smallBlind);
                    console.log("check");
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
                >
                  Start game
                </button>
              </div>
            </div>
          </div>

          {tablePlayers?.map((player: TablePlayer) => {
            const visualPositionIndex = getRotatedSeatIndex(
              player.seatNumber,
              currentUser?.seatNumber,
              INGAME_PLAYER_POSITIONS.length,
            );
            const seatPosition = INGAME_PLAYER_POSITIONS[visualPositionIndex];
            return (
              <PlayerIngameSeat
                key={player.tablePlayerId}
                position={seatPosition.position}
                avatarSrc={player.profileImageUrl}
                playerName={player.username}
                balance={`${player.stax} $`}
                seatNumber={player.seatNumber}
                tableIdProp={params.table}
              />
            );
          })}
        </div>
      </div>

      <BottomPanel
        tableName={tableData.name}
        bigBlind={tableData.bigBlind}
        smallBlind={tableData.smallBlind}
      />
    </div>
  );
}
