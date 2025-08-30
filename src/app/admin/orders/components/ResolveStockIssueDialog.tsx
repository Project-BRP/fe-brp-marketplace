import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import { Input } from "@/components/InputLovable";
import Button from "@/components/buttons/Button";
import { Loader2 } from "lucide-react";
import React, { useMemo, useState } from "react";

interface ResolveStockIssueDialogProps {
  children: React.ReactNode; // trigger button
  onSubmit: (stock: number) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

export const ResolveStockIssueDialog = ({
  children,
  onSubmit,
  isLoading = false,
  title = "Atasi Masalah Stok",
  description = "Masukkan jumlah stok terbaru untuk varian produk ini agar status item diperbarui.",
}: ResolveStockIssueDialogProps) => {
  const [rawStock, setRawStock] = useState<string>("");

  const numericStock = useMemo(() => {
    const n = Number(rawStock);
    return Number.isFinite(n) && n >= 0 ? n : NaN;
  }, [rawStock]);

  const handleSubmit = () => {
    if (!Number.isFinite(numericStock)) return;
    onSubmit(numericStock);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="resolve-stock-value">
            Stok Terbaru
          </label>
          <Input
            id="resolve-stock-value"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            placeholder="contoh: 10"
            value={rawStock}
            onChange={(e) => setRawStock(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Pastikan jumlah ini sesuai dengan stok yang tersedia saat ini.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Batal
            </Button>
          </DialogClose>
          <Button
            variant="green"
            onClick={handleSubmit}
            disabled={isLoading || !Number.isFinite(numericStock)}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResolveStockIssueDialog;
