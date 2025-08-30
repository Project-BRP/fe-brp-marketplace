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

interface ManualShippingCostDialogProps {
  children: React.ReactNode; // trigger
  onSubmit: (cost: number) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  defaultCost?: number;
}

export const ManualShippingCostDialog = ({
  children,
  onSubmit,
  isLoading = false,
  title = "Tambah Ongkir Manual",
  description = "Masukkan biaya pengiriman (opsional). Berlaku untuk pesanan dengan metode MANUAL.",
  defaultCost,
}: ManualShippingCostDialogProps) => {
  const [rawCost, setRawCost] = useState<string>(
    defaultCost !== undefined ? String(defaultCost) : "",
  );

  const numericCost = useMemo(() => {
    const n = Number(rawCost);
    return Number.isFinite(n) && n >= 0 ? n : NaN;
  }, [rawCost]);

  const handleSubmit = () => {
    if (!Number.isFinite(numericCost)) return;
    onSubmit(numericCost);
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
          <label className="text-sm font-medium" htmlFor="manual-shipping-cost">
            Biaya Pengiriman (IDR)
          </label>
          <Input
            id="manual-shipping-cost"
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            placeholder="contoh: 15000"
            value={rawCost}
            onChange={(e) => setRawCost(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Isi 0 jika pelanggan ambil sendiri (pickup).
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
            disabled={isLoading || !Number.isFinite(numericCost)}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Ongkir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManualShippingCostDialog;
