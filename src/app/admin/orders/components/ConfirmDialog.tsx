import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog"; // Impor dari file Dialog Radix Anda
import Button from "@/components/buttons/Button";
import { Loader2 } from "lucide-react";
import React from "react";

interface ConfirmDialogProps {
  children: React.ReactNode; // Ini akan menjadi tombol trigger
  title: string;
  description: string;
  onConfirm: () => void;
  isConfirming?: boolean; // State loading untuk proses konfirmasi
}

export const ConfirmDialog = ({
  children,
  title,
  description,
  onConfirm,
  isConfirming = false,
}: ConfirmDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isConfirming}>
              Batal
            </Button>
          </DialogClose>
          <Button variant="green" onClick={onConfirm} disabled={isConfirming}>
            {isConfirming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Konfirmasi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
