import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog"; // Impor dari file Dialog Radix Anda
import Button from "@/components/buttons/Button";
import { Loader2 } from "lucide-react";
// Nama file baru: components/CancelDialog.tsx (atau di mana pun Anda menyimpannya)
import React, { useState } from "react";

interface CancelDialogProps {
  children: React.ReactNode; // Ini akan menjadi tombol trigger
  onSubmit: (reason: string) => void;
  isLoading: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CancelDialog = ({
  children,
  onSubmit,
  isLoading,
  onOpenChange,
}: CancelDialogProps) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Batalkan Pesanan</DialogTitle>
        </DialogHeader>
        <div>
          <p className="text-gray-600 mb-4">
            Mohon berikan alasan mengapa Anda ingin membatalkan pesanan ini.
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-red-400 focus:outline-none bg-background text-foreground"
            rows={4}
            placeholder="Contoh: Saya salah memesan barang"
          />
          <div className="mt-2">
            <p className="font-semibold text-sm">NOTE</p>
            <p className="text-xs text-muted-foreground mt-1 text-justify">
              Pengembalian dana otomatis (Automated Refund) hanya didukung untuk
              metode pembayaran tertentu. Jika menggunakan metode lain, silakan
              hubungi Admin untuk proses refund manual.
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Tutup
            </Button>
          </DialogClose>
          <Button
            variant="red"
            onClick={handleSubmit}
            disabled={!reason.trim() || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Memproses..." : "Kirim Pembatalan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
