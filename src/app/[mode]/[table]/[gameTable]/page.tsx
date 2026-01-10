"use client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { use, useEffect, useState, useRef } from "react";
import { INGAME_PLAYER_POSITIONS } from "@/constant/player";
import { PlayerIngameSeat } from "@/components/playerIngameSeat";
import Navbar from "@/components/ui/navbar";
import { useTablePlayer } from "@/lib/tanstack/queryTablePlayer";
import { useSession } from "next-auth/react";
import { useWebSocket } from "@/providers/webSocketProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useTable } from "@/lib/tanstack/queryTable";
import BottomPanel from "@/components/section/inGame/bottomPanel";
import { TablePlayer } from "@/types/requestBodys";
import { mapCardRank, mapCardSuit } from "@/lib/mapper";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Type definitions for card data
interface CardDto {
  suit: string; // e.g., "HEARTS", "DIAMONDS", "CLUBS", "SPADES"
  rank: string; // e.g., "ACE", "KING", "2", "3"
}

export default function InGamePage({
  params: paramsPromise,
}: {
  params: Promise<{ mode: string; table: number; gameTable: number }>;
}) {
  const params = use(paramsPromise);
  const tableId = params.table;
  const gameTableId = params.gameTable;
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

  // State to store drawn cards - persists across page refreshes
  const [drawnCards, setDrawnCards] = useLocalStorage<CardDto[]>(
    `gameTable-${gameTableId}-cards`,
    []
  );

  // Use ref to track current cards for duplicate checking
  const drawnCardsRef = useRef<CardDto[]>(drawnCards);

  // Update ref whenever drawnCards changes
  useEffect(() => {
    drawnCardsRef.current = drawnCards;
  }, [drawnCards]);

  // Function to send draw card request to backend
  const handleDrawCard = () => {
    if (!stompClient.client || !stompClient.isConnected) {
      console.error("❌ WebSocket not connected");
      return;
    }

    const payload = {
      gameTableId: gameTableId,
      tableId: tableId,
    };

    try {
      stompClient.client.publish({
        destination: "/app/game/draw",
        body: JSON.stringify(payload),
      });
      console.log("✅ Message published successfully");
    } catch (error) {
      console.error("❌ Failed to publish message:", error);
    }
  };

  // Function to clear all cards
  const clearCards = () => {
    setDrawnCards([]);
    localStorage.removeItem(`gameTable-${gameTableId}-cards`);
    console.log("🧹 Cards cleared");

    if (!stompClient.client || !stompClient.isConnected) {
      console.error("❌ WebSocket not connected");
      return;
    }

    const payload = {
      gameTableId: gameTableId,
      tableId: tableId,
    };

    try {
      stompClient.client.publish({
        destination: "/app/game/resetDeck",
        body: JSON.stringify(payload),
      });
      console.log("✅ Clear card message published successfully");
    } catch (error) {
      console.error("❌ Failed to Clear card publish message:", error);
    }
  };

  useEffect(() => {
    if (!stompClient.client || !stompClient.isConnected) return;

    // Subscribe to general notifications
    const notificationSubscription = stompClient.client.subscribe(
      "/topic/notifications",
      (message) => {
        const notification = JSON.parse(message.body);
        console.log("🔔 Received notification:", notification);

        if (notification.type === `TABLE${tableId}_JOINED`) {
          console.log(notification.content);
          queryClient.invalidateQueries({
            queryKey: ["tablePlayers", tableId],
          });
        }
      }
    );

    // Subscribe to card draws for this specific table
    const cardDestination = `/topic/game/${gameTableId}/card`;

    const cardSubscription = stompClient.client.subscribe(
      cardDestination,
      (message) => {
        try {
          const card: CardDto = JSON.parse(message.body);
          console.log("🎴 Received new card:", card);

          // Use ref to get the most current cards
          const currentCards = drawnCardsRef.current;
          console.log("🎴 Current cards before adding:", currentCards);

          // Check for duplicate card
          const isDuplicate = currentCards.some((existingCard) => {
            const match =
              existingCard.rank === card.rank &&
              existingCard.suit === card.suit;
            console.log(
              `Comparing ${existingCard.rank}${existingCard.suit} with ${card.rank}${card.suit}: ${match}`
            );
            return match;
          });

          console.log("🎴 Is duplicate?", isDuplicate);

          if (isDuplicate) {
            console.error("❌ Duplicate card detected:", card);
            alert(`⚠️ Duplicate card detected: ${card.rank} of ${card.suit}`);
            return; // Don't add duplicate
          }

          // Add card if not duplicate
          setDrawnCards((prevCards) => {
            const newCards = [...prevCards, card];
            console.log("🎴 Updated cards array:", newCards);
            return newCards;
          });
        } catch (error) {
          console.error("❌ Failed to parse card:", error);
        }
      }
    );
    console.log("✅ Subscriptions established successfully");

    const clearCardDestination = `/topic/game/${gameTableId}/deckReset`;

    const resetCardSubscription = stompClient.client.subscribe(
      clearCardDestination,
      (message) => {
        console.log("🧹 Received deck reset message:", message.body);
        setDrawnCards([]);
        localStorage.removeItem(`gameTable-${gameTableId}-cards`);
      }
    );

    return () => {
      console.log("🔌 Unsubscribing from WebSocket topics");
      notificationSubscription.unsubscribe();
      cardSubscription.unsubscribe();
      resetCardSubscription.unsubscribe();
    };
  }, [stompClient, queryClient, gameTableId, tableId, setDrawnCards]);

  useEffect(() => {
    console.log("Current drawn cards:", drawnCards);
  }, [drawnCards]);

  const currentUserId = session?.user?._id;

  // Find current user's actual seat number
  const currentUserPlayer = tablePlayers?.find(
    (p: TablePlayer) => p.userId === Number(currentUserId)
  );
  const currentUserSeatNumber = currentUserPlayer?.seatNumber;

  // Calculate position mapping: current user always at position 1
  const getRotatedPositionIndex = (actualSeatNumber: number): number => {
    if (currentUserSeatNumber === undefined) {
      return actualSeatNumber;
    }

    // Calculate offset to make current user appear at index 0
    const offset = currentUserSeatNumber;
    const totalSeats = INGAME_PLAYER_POSITIONS.length;

    // Rotate positions so current user appears at index 0 (position 1)
    const rotatedIndex = (actualSeatNumber - offset + totalSeats) % totalSeats;

    console.log(
      `Actual Seat: ${actualSeatNumber}, Current User Seat: ${currentUserSeatNumber}, Rotated Index: ${rotatedIndex}`
    );
    return rotatedIndex;
  };

  if (!tableData || isPlayersLoading || isTableLoading) {
    return <div>Loading table...</div>;
  }
  return (
    <div className="w-full flex flex-col items-center">
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
            {/* Community Cards Area */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              {/* Drawn Cards Display */}
              <div className="flex gap-2">
                {drawnCards.map((card, index) => {
                  const isRed = card.suit === "D" || card.suit === "H";
                  const suitColor = isRed
                    ? "text-primary-red"
                    : "text-primary-black";

                  return (
                    <div
                      key={index}
                      className="w-16 h-24 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center border-2 border-gray-300"
                    >
                      <span className={`text-2xl font-bold ${suitColor}`}>
                        {mapCardRank(card.rank)}
                      </span>
                      <span className={`text-3xl ${suitColor}`}>
                        {mapCardSuit(card.suit)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Draw Card Button (for testing) */}
              <div className="flex gap-2">
                <button
                  onClick={handleDrawCard}
                  className="px-4 py-2 bg-brand-accent hover:bg-brand-accent/80 text-white rounded-lg font-semibold transition"
                >
                  Draw Card
                </button>
                <button
                  onClick={clearCards}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
                >
                  Clear Cards
                </button>
              </div>
            </div>
          </div>

          {/* Render Seats */}
          {tablePlayers?.map((player: TablePlayer) => {
            // Get the visual position id based on rotation
            const visualPositionIndex = getRotatedPositionIndex(
              player.seatNumber
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
                tableIdProp={tableId}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom Panel */}
      <BottomPanel
        tableName={tableData.name}
        bigBlind={tableData.bigBlind}
        smallBlind={tableData.smallBlind}
      />
    </div>
  );
}
