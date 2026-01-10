"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import ChooseStaxDialog from "./chooseStaxDialog";
import { useCreateTablePlayer } from "@/lib/tanstack/queryTablePlayer";
import { toast } from "sonner";
import { useMe, useUpdateChips } from "@/lib/tanstack/queryUser";
import { useRouter } from "next/navigation";

type PlayerProps = {
  positionTrue: string;
  positionFalse: string;
  avatarSrc: string;
  playerName: string;
  balance: string;
  isOccupied: boolean;
  seatNumber: number;
  tableIdProp: number;
  mode: string;
  minBuyIn?: number;
  maxBuyIn?: number;
};

export const PlayerSeat = ({
  positionTrue,
  positionFalse,
  avatarSrc,
  playerName,
  balance,
  isOccupied,
  seatNumber,
  tableIdProp,
  mode,
  minBuyIn,
  maxBuyIn,
}: PlayerProps) => {
  const { data: session } = useSession();
  const { data: userProfile } = useMe();
  const { mutateAsync: updateChips } = useUpdateChips();
  const { mutateAsync: createPlayer } = useCreateTablePlayer(
    session?.accessToken ?? ""
  );
  
  const router = useRouter();

  const userName = userProfile?.name || session?.user?.name || "Guest";

  const handleJoin = async (staxAmount: number) => {
    if (session?.user?._id) {
      try {
        const res = await createPlayer({
          userId: Number(session.user._id),
          tableId: tableIdProp,
          stax: staxAmount,
          seatNumber: seatNumber,
        });
        await updateChips({ amount: staxAmount, operation: "DEDUCT" });
        toast.success("Joined table successfully!");
        router.push(`/${mode}/${tableIdProp}/${res.gameTableId}`);
      } catch (error) {
        toast.error("Failed to join table. Please try again.");
        console.error("Join table error:", error);
      }
    }
  };

  const position = isOccupied ? positionTrue : positionFalse;

  return (
    <div
      className={`absolute ${position} flex flex-col items-center transition-all duration-300`}
    >
      {isOccupied ? (
        <div className="flex flex-col sm:flex-row rounded-4xl bg-primary-black justify-center items-center py-1 px-2 sm:py-2 gap-1 sm:gap-3 border-1 border-amber-400 mb-2 shadow-lg">
          <Avatar className="w-10 h-10 md:w-15 md:h-15 lg:w-20 lg:h-20 border-2 border-white/10">
            <AvatarImage src={avatarSrc} />
            <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs sm:text-xl font-bold text-white">
              {playerName}
            </span>
            <span className="text-xs sm:text-sm text-brand-accent">
              {balance}
            </span>
          </div>
        </div>
      ) : (
        <ChooseStaxDialog
          triggerButton={
            <div className="bg-primary-black rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border-2 border-gray-600 hover:border-brand-accent transition-colors cursor-pointer group">
              <span className="text-2xl text-gray-500 group-hover:text-brand-accent">
                +
              </span>
            </div>
          }
          onStaxChosen={handleJoin}
          minBuyIn={minBuyIn}
          maxBuyIn={maxBuyIn}
          userBalance={userProfile?.chips}
        />
      )}
    </div>
  );
};
