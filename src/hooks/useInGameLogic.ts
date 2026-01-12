import { useEffect, useRef, useCallback } from "react";
import { useWebSocket } from "@/providers/webSocketProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { CardDto, CardResponse } from "@/types/requestBodys";

export const useInGameLogic = (tableId: number, gameTableId: number) => {
  const queryClient = useQueryClient();
  const stompClient = useWebSocket();
  const [drawnCards, setDrawnCards] = useLocalStorage<CardDto[]>(
    `gameTable-${gameTableId}-cards`,
    []
  );
  const drawnCardsRef = useRef<CardDto[]>(drawnCards);

  // Sync ref กับ state
  useEffect(() => {
    drawnCardsRef.current = drawnCards;
  }, [drawnCards]);

  // จัดการการส่ง Message
  const sendWSMessage = useCallback(
    (destination: string, extraPayload: object = {}) => {
      if (stompClient.client?.connected) {
        stompClient.client.publish({
          destination,
          body: JSON.stringify({ gameTableId, tableId, ...extraPayload }),
        });
      }
    },
    [stompClient.client, gameTableId, tableId]
  );

  useEffect(() => {
    if (!stompClient.client || !stompClient.isConnected) return;

    const client = stompClient.client;

    const subs = [
      // 1. Notification Sub
      client.subscribe("/topic/notifications", (msg) => {
        const note = JSON.parse(msg.body);
        if (note.type === `TABLE${tableId}_JOINED`) {
          queryClient.invalidateQueries({
            queryKey: ["tablePlayers", tableId],
          });
        }
      }),

      // 2. Card Draw Sub
      client.subscribe(`/topic/game/${gameTableId}/card`, (msg) => {
        const response: CardResponse = JSON.parse(msg.body);
        const newCardsFromBackend = response.cards || [];
        setDrawnCards((prev) => {
          const filteredNewCards = newCardsFromBackend.filter(
            (newCard) =>
              !prev.some(
                (existing) =>
                  existing.rank === newCard.rank &&
                  existing.suit === newCard.suit
              )
          );

          if (filteredNewCards.length === 0) return prev;
          return [...prev, ...filteredNewCards];
        });
      }),

      // 3. Reset Deck Sub
      client.subscribe(`/topic/game/${gameTableId}/deckReset`, () => {
        setDrawnCards([]);
      }),
    ];

    return () => subs.forEach((s) => s.unsubscribe());
  }, [
    stompClient.isConnected,
    tableId,
    gameTableId,
    queryClient,
    setDrawnCards,
  ]);

  return {
    drawnCards,
    drawCard: (amount: number = 1) =>
      sendWSMessage("/app/game/draw", { cardAmount: amount }),
    clearCards: () => sendWSMessage("/app/game/resetDeck"),
    isConnected: stompClient.isConnected,
  };
};
