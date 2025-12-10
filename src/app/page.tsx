import Title from "@/components/section/home/title";
import GameMode from "@/components/section/home/gameMode";
import Navbar from "@/components/ui/navbar";

export default function Home() {
  return (
    <>
    <Navbar />
    <main className="w-full h-full flex-1 flex flex-col justify-center items-center px-4 pt-8 gap-20 md:gap-30">
      <Title />
      <GameMode />
    </main>
    </>
  );
}