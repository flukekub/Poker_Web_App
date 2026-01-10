"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "./ui/switch";
import { useSession } from "next-auth/react";
import { useCreateTable } from "@/lib/tanstack/queryTable";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreateTablePlayer } from "@/lib/tanstack/queryTablePlayer";
import { useUpdateChips } from "@/lib/tanstack/queryUser";
import ChooseStaxDialog from "./chooseStaxDialog";

export default function CreateTableForm({
  gameMode,
  onSuccess,
}: {
  gameMode: string;
  onSuccess?: () => void;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [tableName, setTableName] = useState("");
  const [description, setDescription] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("6");
  const [minBuyIn, setMinBuyIn] = useState("1");
  const [maxBuyIn, setMaxBuyIn] = useState("20");
  const [autoJoin, setAutoJoin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStaxDialog, setShowStaxDialog] = useState(false);
  const [createdTableId, setCreatedTableId] = useState<number | null>(null);

  const createTableMutation = useCreateTable(
    session?.accessToken ?? "",
    gameMode
  );
  const { mutateAsync: updateChips } = useUpdateChips();
  const { mutateAsync: createPlayer } = useCreateTablePlayer(
    session?.accessToken ?? ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) {
      console.error("Missing access token in session");
      return;
    }

    if (!tableName.trim()) {
      if (onSuccess) {
          onSuccess();
        }
      toast.error("Please enter a table name");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await createTableMutation.mutateAsync({
        tableName,
        description: description,
        gameType: gameMode,
        maxPlayers: parseInt(maxPlayers, 10),
        minBuyIn: Number(minBuyIn),
        maxBuyIn: Number(maxBuyIn),
      });

      console.log("Table created:", res);

      if (autoJoin) {
        // Store the created table ID and open the dialog
        setCreatedTableId(res.tableId);
        setShowStaxDialog(true);
      } else {
        // reset form (optional)
        setTableName("");
        setMaxPlayers("0");
        setMinBuyIn("1");
        setMaxBuyIn("20");
        if (onSuccess) {
          onSuccess();
        }
        toast.success("Table has been created");
      }
    } catch (err) {
      console.error("Failed to create table:", err);
      toast.error("Failed to create table");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleJoinTable = async (staxAmount: number) => {
    if (session?.user?._id && createdTableId) {
      try {
        await createPlayer({
          userId: Number(session.user._id),
          tableId: createdTableId,
          stax: staxAmount,
          seatNumber: 0, // First available seat
        });
        await updateChips({ amount: staxAmount, operation: "DEDUCT" });

        toast.success("Joined table successfully!");

        // Reset form and close dialog
        setTableName("");
        setMaxPlayers("6");
        setMinBuyIn("0");
        setMaxBuyIn("0");
        setShowStaxDialog(false);

        if (onSuccess) {
          onSuccess();
        }

        // Redirect to the table page
        router.push(`/${gameMode}/${createdTableId}`);
      } catch (error) {
        toast.error("Failed to join table. Please try again.");
        console.error("Join table error:", error);
      }
    }
  };

  return (
    <form>
      <div className="flex mb-4 gap-4">
        <div className="flex flex-col w-1/3">
          <Label htmlFor="tableName">Table Name</Label>
          <Input
            type="text"
            id="tableName"
            name="tableName"
            required
            className="mt-1 block border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm md:text-md pl-2"
            onChange={(e) => setTableName(e.target.value)}
          />
        </div>
        <div className="flex flex-col flex-grow">
          <Label htmlFor="buyInAmount">Description</Label>
          <Input
            type="text"
            id="description"
            name="description"
            required
            className="mt-1  block border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm md:text-md pl-2"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <div className="flex mb-4 gap-4 ">
        <div className="flex flex-col flex-grow gap-3">
          <Label htmlFor="maxPlayers">Max Players</Label>
          <RadioGroup
            defaultValue="option-three"
            className="flex"
            onValueChange={(value) => setMaxPlayers(value)} // เก็บค่าที่เลือก
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="option-one" />
              <Label htmlFor="option-one">2</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="option-two" />
              <Label htmlFor="option-two">4</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="6" id="option-three" />
              <Label htmlFor="option-three">6</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="9" id="option-four" />
              <Label htmlFor="option-four">9</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex flex-col w-1/3">
          <Label htmlFor="minBuyIn">Min buyin</Label>
          <Input
            type="number"
            id="minBuyIn"
            name="minBuyIn"
            required
            min="1"
            className="mt-1 block border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm md:text-md pl-2"
            onChange={(e) => setMinBuyIn(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-1/3">
          <Label htmlFor="maxBuyIn">Max buyin</Label>
          <Input
            type="number"
            id="maxBuyIn"
            name="maxBuyIn"
            required
            min="10"
            className="mt-1 block border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm md:text-md pl-2"
            onChange={(e) => setMaxBuyIn(e.target.value)}
          />
        </div>
      </div>
      <div className="flex mb-4 gap-4">
        <Switch
          id="autoJoin"
          onCheckedChange={(checked) => setAutoJoin(checked)}
        />
        <Label htmlFor="autoJoin">Auto join when table created</Label>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-[#236C6B] text-white rounded-md hover:bg-blue-700 transition cursor-pointer"
        onClick={handleSubmit}
      >
        Create Table
      </button>

      {showStaxDialog && (
        <ChooseStaxDialog
          triggerButton={<div style={{ display: "none" }} />}
          minBuyIn={Number(minBuyIn)}
          maxBuyIn={Number(maxBuyIn)}
          userBalance={session?.user?.chips}
          onStaxChosen={handleJoinTable}
          defaultOpen={true}
        />
      )}
    </form>
  );
}
