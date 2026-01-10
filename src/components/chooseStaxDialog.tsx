import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ChooseStaxForm from "./chooseStaxForm";
import { useState, useEffect } from "react";

export default function ChooseStaxDialog({
  triggerButton,
  minBuyIn,
  maxBuyIn,
  userBalance,
  onStaxChosen,
  defaultOpen = false,
}: {
  triggerButton: React.ReactNode;
  minBuyIn?: number;
  maxBuyIn?: number;
  userBalance?: number;
  onStaxChosen: (amount: number) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="bg-surface-panel">
        <DialogHeader>
          <DialogTitle>Create Table</DialogTitle>
          <DialogDescription>Create Table</DialogDescription>
          <ChooseStaxForm
            onConfirm={(amount) => {
              console.log("Chosen stax amount:", amount);
              onStaxChosen(amount);
              setOpen(false);
            }}
            min={minBuyIn}
            max={maxBuyIn}
            userBalance={userBalance}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
