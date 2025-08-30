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
import React, { useState } from "react";

interface ShippingReceiptDialogProps {
  children: React.ReactNode; // trigger button
  title?: string;
  description?: string;
  onSubmit: (shippingReceipt: string) => void;
  isLoading?: boolean;
}

export const ShippingReceiptDialog = ({
  children,
  title = "Input Nomor Resi",
  description = "Masukkan nomor resi pengiriman untuk memperbarui status menjadi Dikirim (SHIPPED).",
  onSubmit,
  isLoading = false,
}: ShippingReceiptDialogProps) => {
  const [receipt, setReceipt] = useState("");

  const handleSubmit = () => {
    if (!receipt.trim()) return;
    onSubmit(receipt.trim());
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
          <label className="text-sm font-medium" htmlFor="shipping-receipt">
            Nomor Resi
          </label>
          <Input
            id="shipping-receipt"
            placeholder="contoh: JNE1234567890"
            value={receipt}
            onChange={(e) => setReceipt(e.target.value)}
          />
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
            disabled={isLoading || !receipt.trim()}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan & Perbarui
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShippingReceiptDialog;
