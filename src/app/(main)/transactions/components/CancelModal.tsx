import Button from "@/components/buttons/Button";
import { useState } from "react";

// Komponen Modal untuk Pembatalan
export const CancelModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  isLoading: boolean;
}) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Batalkan Pesanan</h2>
        <p className="text-gray-600 mb-4">
          Mohon berikan alasan mengapa Anda ingin membatalkan pesanan ini.
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-red-400 focus:outline-none"
          rows={4}
          placeholder="Contoh: Saya salah memesan barang"
        />
        <p className="font-semibold text-sm">NOTE</p>
        <p className="text-xs text-gray-500 mt-2 text-justify">
          Pengembalian dana secara otomatis (Automated Refund) hanya didukung
          untuk metode pembayaran kartu kredit, Gopay, ShopeePay, QRIS, Kredivo,
          dan Akulaku. Jika Anda menggunakan metode pembayaran lain silakan
          menghubungi Admin untuk refund.
        </p>
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Tutup
          </Button>
          <Button
            variant="red"
            onClick={handleSubmit}
            disabled={!reason.trim() || isLoading}
          >
            {isLoading ? "Memproses..." : "Kirim Pembatalan"}
          </Button>
        </div>
      </div>
    </div>
  );
};
