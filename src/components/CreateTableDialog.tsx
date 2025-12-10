import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateTableForm from "./CreateTableForm";
import { useState } from "react";

export default function CreateTableDialog({
  triggerButton,
  gameMode,
}: {
  triggerButton: React.ReactNode;
  gameMode: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="bg-surface-panel">
        <DialogHeader>
          <DialogTitle>Create Table</DialogTitle>
          <DialogDescription>Create Table</DialogDescription>
          <CreateTableForm
            gameMode={gameMode}
            onSuccess={() => setOpen(false)}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
