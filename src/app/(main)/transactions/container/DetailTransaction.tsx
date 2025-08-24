"use client";

import LoadingAnimation from "@/components/LoadingAnimation";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import { Transaction, TransactionItem } from "@/types/transaction";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaBox,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaReceipt,
  FaTimesCircle,
  FaTruck,
} from "react-icons/fa";
import {
  useCancelTransaction,
  useGetTransactionById,
} from "../../hooks/useTransaction";
import { CancelModal } from "../components/CancelModal";
import PaymentGateway from "../components/PaymentGateway";

// --- Helper Components ---

// Komponen untuk menampilkan status dengan warna dan ikon
const StatusTimeline = ({ tx }: { tx: Transaction }) => {
  // Gabungkan status manual dan pengiriman jika ada.
  const allEvents = [];
  if (tx.manualStatus) {
    allEvents.push({ status: tx.manualStatus });
  }
  // Hindari duplikasi jika statusnya sama (misal: CANCELLED bisa ada di keduanya)
  if (tx.deliveryStatus && tx.deliveryStatus !== tx.manualStatus) {
    allEvents.push({ status: tx.deliveryStatus });
  }

  // Jika tidak ada event, tampilkan pesan.
  if (allEvents.length === 0) {
    return (
      <p className="text-gray-500">
        Tidak ada riwayat status untuk ditampilkan.
      </p>
    );
  }

  const getStatusInfo = (status: string) => {
    const s = status.toUpperCase();
    if (s.includes("UNPAID"))
      return {
        icon: <FaClock className="text-yellow-500" />,
        text: `Menunggu Pembayaran`,
      };
    if (s.includes("PAID"))
      return {
        icon: <FaCheckCircle className="text-green-500" />,
        text: `Pembayaran Berhasil`,
      };
    if (s.includes("PROCESSING"))
      return {
        icon: <FaClock className="text-blue-500" />,
        text: `Pesanan Diproses`,
      };
    if (s.includes("SHIPPED"))
      return {
        icon: <FaTruck className="text-blue-500" />,
        text: `Pesanan Dikirim`,
      };
    if (s.includes("DELIVERED"))
      return {
        icon: <FaBox className="text-green-500" />,
        text: `Pesanan Tiba`,
      };
    if (s.includes("COMPLETED") || s.includes("COMPLETE"))
      return {
        icon: <FaCheckCircle className="text-purple-500" />,
        text: `Pesanan Selesai`,
      };
    if (s.includes("CANCELLED"))
      return {
        icon: <FaTimesCircle className="text-red-500" />,
        text: `Pesanan Dibatalkan`,
      };
    return { icon: <FaReceipt className="text-gray-500" />, text: status };
  };

  return (
    <div className="space-y-4">
      {allEvents.map((event, index) => {
        const { icon, text } = getStatusInfo(event.status);
        return (
          <div key={index} className="flex items-center gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              {icon}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{text}</p>
              <p className="text-sm text-gray-500">
                Status terakhir diperbarui:{" "}
                {new Date(tx.updatedAt).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const priceConverter = (price: number, quantity: number): number => {
  return price / quantity;
};

// Komponen untuk menampilkan item produk
const ProductItem = ({ item }: { item: TransactionItem }) => (
  <div className="flex items-center gap-4 py-3">
    <img
      src={
        item.variant?.imageUrl ||
        "https://placehold.co/64x64/e2e8f0/e2e8f0?text=Img"
      }
      alt={item.variant?.product.name}
      className="w-16 h-16 object-cover rounded-lg border"
      onError={(e) => {
        e.currentTarget.src =
          "https://placehold.co/64x64/e2e8f0/e2e8f0?text=Img";
      }}
    />
    <div className="flex-1">
      <p className="font-semibold text-black">{item.variant?.product.name}</p>
      <p className="font-normal text-black">
        {item.variant?.packaging.name} / {item.variant?.weight_in_kg} kg
      </p>
      <p className="text-sm text-gray-500">
        {item.quantity} x Rp{" "}
        {priceConverter(item.priceRupiah, item.quantity).toLocaleString(
          "id-ID",
        )}
      </p>
      <p className="font-normal text-red-500">
        {item.isStockIssue ? "Ada masalah stok untuk variant ini" : ""}
      </p>
    </div>
    <p className="font-semibold text-gray-900">
      Rp {item.priceRupiah.toLocaleString("id-ID")}
    </p>
  </div>
);

// --- Komponen Utama ---

export default function TransactionDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transaction_id");

  const [isCancelModalOpen, setCancelModalOpen] = useState(false);

  const {
    data: transactionData,
    isLoading,
    error,
    refetch,
  } = useGetTransactionById(transactionId || "");

  const { mutate: cancelTransaction, isPending: isCancelling } =
    useCancelTransaction();

  useEffect(() => {
    if (!transactionId) {
      router.replace("/transactions");
    }
  }, [transactionId, router]);

  if (!transactionId) {
    return (
      <LoadingAnimation message="Mengalihkan, ID transaksi tidak ditemukan..." />
    );
  }

  if (isLoading)
    return <LoadingAnimation message="Memuat detail transaksi..." />;
  if (error) {
    router.replace("/transactions");
    toast.error("Gagal memuat detail transaksi. Silakan coba lagi.");
  }
  if (!transactionData)
    return (
      <div className="p-6 text-center text-gray-500">
        Transaksi tidak ditemukan.
      </div>
    );

  const tx = transactionData.data;

  const isPendingPayment =
    tx.manualStatus?.toUpperCase().includes("UNPAID") ||
    tx.deliveryStatus?.toUpperCase().includes("UNPAID");

  const canBeCancelled =
    tx.manualStatus?.toUpperCase().includes("PAID") ||
    tx.deliveryStatus?.toUpperCase().includes("PAID");

  const handleCancelSubmit = (reason: string) => {
    cancelTransaction(
      { transactionId: tx.id, payload: { cancelReason: reason } },
      {
        onSuccess: () => {
          setCancelModalOpen(false);
          refetch(); // Muat ulang data transaksi untuk melihat status terbaru
        },
        onError: (err) => {
          console.error("Gagal membatalkan transaksi:", err);
          // Anda bisa menambahkan notifikasi error di sini
        },
      },
    );
  };

  return (
    <>
      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onSubmit={handleCancelSubmit}
        isLoading={isCancelling}
      />
      <div className="min-h-screen container mx-auto px-4 py-6">
        <div className="p-4 sm:p-6 w-full mx-auto">
          {/* --- Header --- */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex flex-row justify-start items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.replace("/transactions")}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 p-4 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Detail Pesanan
                  </h1>
                  <p className="text-sm text-gray-500">ID: {tx.id}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2 sm:mt-0">
                Dipesan pada{" "}
                {new Date(tx.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* --- Kolom Kiri (Detail) --- */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Pesanan */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Status Pesanan
                  </h3>
                  {canBeCancelled && (
                    <Button
                      variant="red"
                      onClick={() => setCancelModalOpen(true)}
                    >
                      Batalkan Pesanan
                    </Button>
                  )}
                </div>
                <StatusTimeline tx={tx} />
              </div>

              {/* Rincian Produk */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Rincian Produk
                </h3>
                <div className="divide-y divide-gray-200">
                  {tx.transactionItems?.map((item) => (
                    <ProductItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* --- Kolom Kanan (Info & Pembayaran) --- */}
            <div className="space-y-6">
              {/* Alamat Pengiriman */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt /> Alamat Pengiriman
                </h3>
                <p className="font-semibold text-gray-800">{tx.userName}</p>
                <p className="text-sm text-gray-600">{tx.userPhoneNumber}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {tx.shippingAddress}, {tx.city}, {tx.province},{" "}
                  {tx.postalCode}
                </p>
              </div>

              {/* Rincian Pembayaran */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaReceipt /> Rincian Pembayaran
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>{" "}
                    <span className="font-medium">
                      Rp {tx.cleanPrice.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      PPN ({tx.PPNPercentage}%)
                    </span>{" "}
                    <span className="font-medium">
                      Rp{" "}
                      {(tx.priceWithPPN - tx.cleanPrice).toLocaleString(
                        "id-ID",
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ongkos Kirim</span>{" "}
                    <span className="font-medium">
                      Rp {tx.shippingCost?.toLocaleString("id-ID") ?? "0"}
                    </span>
                  </div>
                  <div className="border-t my-2"></div>
                  <div className="flex justify-between font-bold text-base">
                    <span className="text-gray-900">Total</span>{" "}
                    <span className="text-gray-900">
                      Rp {tx.totalPrice.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Gateway Pembayaran --- */}
          {isPendingPayment && <PaymentGateway Id={tx.id} />}
        </div>
        {tx.transactionItems &&
          tx.transactionItems.length > 0 &&
          tx.transactionItems.find((item) => item.isStockIssue) &&
          !tx.manualStatus?.toUpperCase().includes("CANCEL") &&
          !tx.deliveryStatus?.toUpperCase().includes("CANCEL") && (
            <div className="flex justify-center items-center mx-auto">
              <Typography variant="p" className="text-red-500 text-center mt-4">
                Beberapa produk dalam pesanan ini sedang mengalami masalah stok.
                Anda bisa menunggu admin untuk mengirimkan barang setelah
                restock, atau anda juga dapat membatalkan transaksi ini
                sekarang.
              </Typography>
            </div>
          )}
        {tx.isRefundFailed && (
          <div className="flex justify-center items-center mx-auto">
            <Typography variant="p" className="text-red-500 text-center mt-4">
              Pengembalian dana secara otomatis untuk transaksi ini tidak bisa
              dilakukan. Silakan hubungi Admin untuk bantuan lebih lanjut.
            </Typography>
          </div>
        )}
      </div>
    </>
  );
}
