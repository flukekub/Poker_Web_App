import Image from "next/image";
import Link from "next/link";

export default function GameMode() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 w-full">
      <Link
        href="/NLHE"
        className="group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 w-full max-w-[300px] h-[180px] md:h-[200px] p-0 shadow-lg"
      >
        <div className="relative w-full h-full">
          <Image
            src="/NLHE.png?height=200&width=300"
            alt="NLHE poker cards"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h3 className="text-white text-2xl font-bold">NLHE</h3>
          </div>
        </div>
      </Link>

      <Link href="/ShortDeck" className="group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 w-full max-w-[300px] h-[180px] md:h-[200px] p-0 shadow-lg">
        <div className="relative w-full h-full">
          <Image
            src="/ShortDeck.png?height=200&width=300"
            alt="Short Deck poker cards"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h3 className="text-white text-2xl font-bold">Short Deck</h3>
          </div>
        </div>
      </Link>
    </div>
  );
}
