"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useSession } from "next-auth/react";
import { useCreateTable } from "@/lib/tanstack/queryTable";
import { toast } from "sonner";

export default function CreateTableForm({
  gameMode,
  onSuccess,
}: {
  gameMode: string;
  onSuccess?: () => void;
}) {
  const { data: session } = useSession();
  const [tableName, setTableName] = useState("");
  const [description, setDescription] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("6");
  const [minBuyIn, setMinBuyIn] = useState("");
  const [maxBuyIn, setMaxBuyIn] = useState("");
  const [autoJoin, setAutoJoin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createTableMutation = useCreateTable(
    session?.accessToken ?? "",
    gameMode
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) {
      console.error("Missing access token in session");
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
      // reset form (optional)
      setTableName("");
      setMaxPlayers("6");
      setMinBuyIn("0");
      setMaxBuyIn("0");
      if (onSuccess) {
        onSuccess();
        toast.success("Event has been created")
      }
    } catch (err) {
      console.error("Failed to create table:", err);
      toast.error("Failed to create table");
    } finally {
      setIsSubmitting(false);
      if (autoJoin) {
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
            min="5"
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
            min="5"
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
    </form>
  );
}
