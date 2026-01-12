import { mapCardRank, mapCardSuit } from "@/lib/mapper";
export function CardItem({ card }: { card: any }) {
  const isRed = card.suit === "D" || card.suit === "H";
  const color = isRed ? "text-primary-red" : "text-primary-black";
  return (
    <div className="w-16 h-24 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center border-2 border-gray-300 animate-in fade-in zoom-in duration-300">
      <span className={`text-2xl font-bold ${color}`}>{mapCardRank(card.rank)}</span>
      <span className={`text-3xl ${color}`}>{mapCardSuit(card.suit)}</span>
    </div>
  );
}