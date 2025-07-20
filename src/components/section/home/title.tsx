import { Spade } from "lucide-react";


export default function Title() {
  return (
    <div className="flex items-center gap-4 mb-16">
      <h1 className="text-4xl md:text-5xl font-bold text-white">
        Poker Online
      </h1>
      <div className="  rounded-2xl p-3 border-4 border-white">
        <Spade  />
      </div>
    </div>
  );
}
