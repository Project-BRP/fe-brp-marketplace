"use client";

import getUser from "@/app/(auth)/hooks/getUser";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import Navbar from "@/layouts/Navbar";
import useUserStore from "@/store/userStore";
import { Transaction } from "@/types/transaction";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetTransactionsByUser } from "../../hooks/useTransaction";

// Komponen untuk menampilkan status dengan warna yang sesuai
const StatusBadge = ({ status }: { status: string }) => {
  const statusColors: { [key: string]: string } = {
    // Delivery Status
    PENDING: "bg-yellow-100 text-yellow-800",
    SHIPPED: "bg-blue-100 text-blue-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    // Manual Status
    PAID: "bg-green-100 text-green-800",
    COMPLETED: "bg-purple-100 text-purple-800",
    FAILED: "bg-red-100 text-red-800",
  };

  const color =
    statusColors[status.toUpperCase()] || "bg-gray-100 text-gray-800";

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>
      {status}
    </span>
  );
};

// Komponen Card untuk setiap transaksi agar lebih modular
const TransactionCard = ({ tx }: { tx: Transaction }) => {
  // Mengambil item pertama dari transaksi untuk ditampilkan sebagai representasi
  const firstItem = tx.transactionItems?.[0];
  const product = firstItem?.variant?.product;

  const displayStatus = tx.deliveryStatus || tx.manualStatus || "UNDEFINED";

  return (
    <Link href={`/transactions?transaction_id=${tx.id}`} legacyBehavior>
      <a className="block bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <img
            src={
              product?.imageUrl ??
              "https://placehold.co/64x64/e2e8f0/e2e8f0?text=Img"
            }
            alt={product?.name ?? "Product Image"}
            className="w-16 h-16 object-cover rounded-md border"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/64x64/e2e8f0/e2e8f0?text=Img";
            }}
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-md font-semibold text-gray-800">
                  {/* Menampilkan nama produk pertama atau jumlah item jika tidak ada nama */}
                  {product?.name ?? `${tx.transactionItems?.length || 0} items`}
                  {tx.transactionItems && tx.transactionItems.length > 1 && (
                    <span className="text-sm text-gray-500 ml-2">
                      + {tx.transactionItems.length - 1} lainnya
                    </span>
                  )}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(tx.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  Rp {tx.totalPrice.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
            <div className="border-t my-3"></div>
            <div className="flex justify-between items-center text-sm">
              <p className="text-gray-600">
                Metode: <span className="font-medium">{tx.method}</span>
              </p>
              <StatusBadge status={displayStatus} />
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

const TransactionHistoryList = () => {
  const router = useRouter();

  const {
    data: transactionData,
    isLoading,
    error,
    refetch: refetchTransactions,
  } = useGetTransactionsByUser();

  const { setUserData } = useUserStore();
  const { getUserData, refetch } = getUser();

  const [transactions, setTransactions] = useState<Transaction[]>(
    transactionData?.data?.transactions || [],
  );

  useEffect(() => {
    const fetchTransactions = async () => {
      const fetchedTransactions = await refetchTransactions();
      setTransactions(fetchedTransactions?.data?.data?.transactions || []);
    };

    fetchTransactions();
  }, [refetchTransactions]);

  useEffect(() => {
    const syncUser = async () => {
      const dataToSync = getUserData?.data ?? (await refetch())?.data?.data;
      if (dataToSync) {
        setUserData(dataToSync);
      }
    };

    syncUser();
  }, [getUserData, refetch, setUserData]);

  if (isLoading) {
    return <div className="p-4 text-center">Memuat riwayat transaksi...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Gagal memuat data. Silakan coba lagi.
      </div>
    );
  }
  return (
    <>
      <Navbar />
      <div className="min-h-screen container mx-auto px-4 py-6">
        <div className="p-4 sm:p-6 w-full mx-auto">
          <div className="flex flex-row gap-4 justify-start items-center pb-6">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 p-4 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Typography
              variant="h4"
              className="text-2xl font-bold text-gray-900"
            >
              Riwayat Transaksi
            </Typography>
          </div>
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((tx: Transaction) => (
                <TransactionCard key={tx.id} tx={tx} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-4 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">
                Anda belum memiliki riwayat transaksi.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TransactionHistoryList;
