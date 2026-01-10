"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useMe } from "@/lib/tanstack/queryUser";

type PlayerIngameProps = {
  position: string;
  avatarSrc: string;
  playerName: string;
  balance: string;
  seatNumber: number;
  tableIdProp: number;
};

export const PlayerIngameSeat = ({
  position,
  avatarSrc,
  playerName,
  balance,
  seatNumber,
  tableIdProp,
}: PlayerIngameProps) => {
  const { data: session } = useSession();
  const { data: userProfile } = useMe();


  const userName = userProfile?.name || session?.user?.name || "Guest";

  return (
    <div
      className={`absolute ${position} flex flex-col items-center transition-all duration-300`}
    >
      <div className="flex flex-col sm:flex-row rounded-4xl bg-primary-black justify-center items-center py-1 px-1 sm:py-2 gap-1 sm:gap-3 border-1 border-amber-400 mb-2 shadow-lg">
        <Avatar className="w-8 h-8 md:w-15 md:h-15 lg:w-20 lg:h-20 border-2 border-white/10">
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
    </div>
  );
};
