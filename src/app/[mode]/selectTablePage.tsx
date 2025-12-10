"use client";
import PersonIcon from "@mui/icons-material/Person";
//import { useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Navbar from "@/components/ui/navbar";
import Link from "next/link";
import CreateTableDialog from "@/components/CreateTableDialog";
import { useTables } from "@/lib/tanstack/queryTable";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/providers/webSocketProvider";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function SelectTablePage({
  params: gameMode,
}: {
  params: { mode: string };
}) {
  const { data: session } = useSession();
  type TableRow = {
    tableId: number;
    tableName: string;
    gameType: string;
    minBuyIn: number;
    maxBuyIn: number;
    maxPlayers: number;
    currentPlayers: number;
    isActive: boolean;
    createdAt: string;
  };
  const queryClient = useQueryClient();
  const stompClient = useWebSocket();
  const {
    data: rawTables = [],
    isLoading,
    error,
  } = useTables(session?.accessToken, gameMode.mode);

  useEffect(() => {
    // Safety check: ensure client exists and is actually connected
    if (!stompClient.client || !stompClient.isConnected) return;

    console.log("Subscribing to table updates...");

    const subscription = stompClient.client?.subscribe(
      "/topic/notifications",
      (message) => {
        const notification = JSON.parse(message.body);
        console.log("Received notification:", notification);
        // Check for your specific event type
        // (Assuming your backend sends 'TABLE_UPDATED' when a table is created/joined)
        if (notification.type === "TABLE_UPDATED") {
          console.log("Update received! Refetching tables...");

          // IMPORTANT: This key must match the one in your useTables hook
          queryClient.invalidateQueries({
            queryKey: ["tables", gameMode.mode],
          });
        }
      }
    );

    // Cleanup: Unsubscribe when the user leaves the page or component unmounts
    return () => {
      subscription?.unsubscribe();
    };
  }, [stompClient, queryClient, gameMode.mode]);

  const tableData = rawTables as TableRow[];
  // useEffect(() => {
  //   console.log("Tables data:", tableData);
  // }, [tableData]);
  const router = useRouter();
  const handleJoin = (tableId: number) => {
    if (!tableId) return;
    router.push(`/${gameMode.mode}/${tableId}`);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="w-full flex justify-center items-center py-20 text-white">
          Loading tables...
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="w-full flex justify-center items-center py-20 text-red-400">
          Failed to load tables. Please try again.
        </div>
      </>
    );
  }
  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col justify-center items-center px-4 pt-8 gap-20 md:gap-30 ">
        <Link
          href="/"
          className="absolute top-4 left-4 z-20 bg-surface-panel hover:bg-brand-accent text-white rounded-full p-2 px-4 shadow transition cursor-pointer flex items-center gap-2"
          aria-label="ย้อนกลับ"
        >
          <ArrowBackIcon /> {gameMode.mode}
        </Link>
        <CreateTableDialog
          triggerButton={
            <span className="absolute top-4 left-40 z-20 px-4 py-2 bg-brand-accent text-white rounded-xl transition cursor-pointer hover:scale-110">
              Create Table
            </span>
          }
          gameMode={gameMode.mode}
        />
        <div className="w-full max-w-full md:w-[800px] bg-surface-shell rounded-3xl shadow-lg p-5">
          <ul className="space-y-2">
            {tableData.map((table) => (
              <li
                key={table.tableId}
                className="p-4 md:pl-10 bg-surface-panel md:rounded-2xl rounded-3xl hover:bg-surface-panel-hover transition grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4"
              >
                <div className="md:col-span-1 text-center md:text-left">
                  <h2 className="text-xl font-semibold text-white">
                    {table.tableName}
                  </h2>
                  <p className="text-sm text-gray-400">{table.gameType}</p>
                </div>
                <div className="md:col-span-1 text-center md:text-left">
                  <p className="text-gray-300">
                    Buy-in range: {table.minBuyIn} – {table.maxBuyIn} chips
                  </p>
                  <p
                    className="text-xs text-gray-500"
                    suppressHydrationWarning={true}
                  >
                    Created: {new Date(table.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="md:col-span-1 flex justify-center">
                  <span className="px-4 py-2 bg-brand-accent text-white rounded-xl transition w-full md:w-auto text-center">
                    Min: {table.minBuyIn} / Max: {table.maxBuyIn}
                  </span>
                </div>
                <div className="md:col-span-1 flex justify-center md:justify-end">
                  <button
                    className="px-4 py-2 bg-white text-primary font-bold rounded-3xl transition flex items-center justify-center gap-2 w-full md:w-auto cursor-pointer disabled:opacity-60"
                    disabled={!table.isActive}
                    onClick={() => handleJoin(table.tableId)}
                  >
                    {table.currentPlayers}/{table.maxPlayers} players
                    <PersonIcon fontSize="small" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
