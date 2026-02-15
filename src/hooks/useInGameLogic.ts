import { useEffect, useCallback } from "react";
import { useWebSocket } from "@/providers/webSocketProvider";
import { useQueryClient } from "@tanstack/react-query";


export const useInGameLogic = (tableId: number, gameTableId: number) => {
  const queryClient = useQueryClient();
  const stompClient = useWebSocket();


  const sendWSMessage = useCallback(
    (destination: string, extraPayload: object = {}) => {
      if (stompClient.client?.connected) {
        stompClient.client.publish({
          destination,
          body: JSON.stringify({ gameTableId, tableId, ...extraPayload }),
        });
      }
    },
    [stompClient.client, gameTableId, tableId],
  );

  useEffect(() => {
    if (!stompClient.client || !stompClient.isConnected) return;

    const client = stompClient.client;

    const subs = [

      client.subscribe("/topic/notifications", (msg) => {
        const note = JSON.parse(msg.body);
        console.log(note,"zaza");
        if (note.type === `TABLE${tableId}_JOINED`) {
          queryClient.invalidateQueries({
            queryKey: ["tablePlayers", tableId],
          });
        }
      }),

      // client.subscribe(`/topic/game/${gameTableId}/deckReset`, () => { เป็นตัวอย่างเผื่อลืม
      //   setDrawnCards([]);
      // }),
    ];

    return () => subs.forEach((s) => s.unsubscribe());
  }, [
    stompClient.client,
    stompClient.isConnected,
    tableId,
    gameTableId,
    queryClient,
  ]);

  return {
    //clearCards: () => sendWSMessage("/app/game/resetDeck"),
    startGame: (
      dealerSeatNumber: number,
      smallBlindAmount: number,
      bigBlindAmount: number,
    ) =>
      sendWSMessage("app/game/start", {
        dealerSeatNumber,
        smallBlindAmount,
        bigBlindAmount,
      }),
    isConnected: stompClient.isConnected,
  };
};
