import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeleteTablePlayer } from "@/lib/tanstack/queryTablePlayer";

export function HeadPanel({
  gameMode,
  tablePlayerId,
  token,
}: {
  gameMode: string;
  tablePlayerId: number;
  token: string | undefined;
}) {
  const router = useRouter();
  const { mutate: deletePlayer, isPending } = useDeleteTablePlayer(token);
  const handleLeave = () => {
    deletePlayer(tablePlayerId, {
      onSuccess: () => {
        router.push(`/${gameMode}`);
      },
    });
  };
  return (
    <div className="w-full p-4 flex items-center z-50  gap-2">
      <Link
        href={`/${gameMode}`}
        className="inline-flex items-center gap-2 bg-surface-panel hover:bg-brand-accent text-white rounded-full p-2 px-4 shadow-md transition-colors pointer-events-auto"
        aria-label="Back"
      >
        <ArrowBackIcon />
        <span className="hidden sm:inline">Back</span>
      </Link>
      <button
        className="inline-flex items-center gap-2 bg-primary-red text-white rounded-full p-2 px-4 shadow-md  cursor-pointer"
        aria-label="Leave"
        onClick={handleLeave}
      >
        <span className="hidden sm:inline">
          {isPending ? "Leaving..." : "Leave"}
        </span>
      </button>
    </div>
  );
}
