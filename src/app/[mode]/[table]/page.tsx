"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { use } from "react";

export default function Table({
  params: paramsPromise,
}: {
  params: Promise<{ mode: string; table: string }>;
}) {
  const params = use(paramsPromise);
  const tempLogic = true;

  type PlayerProps = {
    positionTrue: string;
    positionFalse: string;
    avatarSrc: string;
    playerName: string;
    balance: string;
  };

  const Player: React.FC<PlayerProps> = ({
    positionTrue,
    positionFalse,
    avatarSrc,
    playerName,
    balance,
  }) => {
    const position = tempLogic ? positionTrue : positionFalse;

    return (
      <div className={`absolute ${position} flex flex-col items-center`}>
        {tempLogic ? (
          <div className="flex flex-col sm:flex-row rounded-4xl bg-surface-panel justify-center items-center py-1 px-2 sm:py-2 gap-1 sm:gap-3 border-1 border-amber-400 mb-2">
            <Avatar className="w-10 h-10 md:w-15 md:h-15 lg:w-20 lg:h-20">
              <AvatarImage src={avatarSrc} />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs sm:text-xl">{playerName}</span>
              <span className="text-xs sm:text-sm">{balance}</span>
            </div>
          </div>
        ) : (
          <div className="bg-[#1E1E1E] rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border-1 border-[#7F7B7B]">
            +
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-1 flex-col justify-center items-center px-4 pt-8">
      <div className="w-full flex flex-col justify-center items-center px-4 pt-8 gap-20 md:gap-30">
        <Link
          href={`/${params.mode}`}
          className="absolute top-4 left-4 z-20 bg-surface-panel hover:bg-brand-accent text-white rounded-full p-2 px-4 shadow transition cursor-pointer flex items-center gap-2"
          aria-label="ย้อนกลับ"
        >
          <ArrowBackIcon />
        </Link>
      </div>
      <div className="relative w-full h-[500px] sm:w-[700px] sm:h-[450px] lg:w-[900px] lg:h-[500px] mx-auto">
        {/* โต๊ะกลาง */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[500px] sm:w-[600px] sm:h-[350px] lg:w-[800px] lg:h-[400px] rounded-[45%/40%] bg-primary-black border-4 border-[#236C6B]" />

        {/* Players */}
        <Player
          positionFalse="left-1/2 bottom-[-15%] -translate-x-1/2"
          positionTrue="left-1/2 bottom-[-15%] -translate-x-1/2  sm:bottom-[-15%]"
          avatarSrc="https://github.com/shadcn.png"
          playerName="Player 1"
          balance="9999 $"
        />
        <Player
          positionFalse="right-[5%] bottom-[5%]"
          positionTrue="right-[5%] bottom-[5%] sm:right-[-5%] sm:bottom-[-5%]"
          avatarSrc="https://github.com/shadcn.png"
          playerName="Player 2"
          balance="8888 $"
        />
        <Player
          positionFalse="top-[40%] right-[-8%]"
          positionTrue="right-[-4%] top-[40%]  sm:top-[40%] sm:right-[-18%]"
          avatarSrc="https://github.com/shadcn.png"
          playerName="Player 3"
          balance="7777 $"
        />
        <Player
          positionFalse="right-[5%] top-[5%]"
          positionTrue="right-[5%] top-[5%] sm:right-[-5%] sm:top-[-5%]"
          avatarSrc="https://github.com/shadcn.png"
          playerName="Player 4"
          balance="6666 $"
        />
        <Player
          positionFalse="right-[20%] sm:right-[30%] top-[-10%]"
          positionTrue="right-[20%] sm:right-[25%] top-[-15%]"
          avatarSrc="https://github.com/shadcn.png"
          playerName="Player 5"
          balance="5555 $"
        />
        <Player
          positionFalse="left-[20%] sm:left-[30%] top-[-10%]"
          positionTrue="left-[20%] sm:left-[25%] top-[-15%]"
          avatarSrc="https://github.com/shadcn.png"
          playerName="Player 6"
          balance="4444 $"
        />
        <Player
          positionFalse="left-[5%] top-[5%]"
          positionTrue="left-[5%] top-[5%] sm:left-[-5%] sm:top-[-5%]"
          avatarSrc="https://github.com/shadcn.png"
          playerName="Player 7"
          balance="3333 $"
        />
        <Player
          positionFalse="left-[-8%] sm:left-[-10%] top-[40%]"
          positionTrue="left-[-4%] top-[40%] sm:left-[-18%] "
          avatarSrc="https://github.com/shadcn.png"
          playerName="Player 8"
          balance="2222 $"
        />
        <Player
          positionFalse="left-[5%] bottom-[5%]"
          positionTrue="left-[5%] bottom-[5%] sm:left-[-5%] sm:bottom-[-5%]"
          avatarSrc="https://github.com/shadcn.png"
          playerName="Player 9"
          balance="1111 $"
        />
      </div>
    </div>
  );
}
