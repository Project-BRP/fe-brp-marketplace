"use client";

import getUser from "@/app/(auth)/hooks/getUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { DateRangePicker } from "@/components/DateRangePicker";
import LoadingAnimation from "@/components/LoadingAnimation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import Footer from "@/layouts/Footer";
import Navbar from "@/layouts/Navbar";
import useUserStore from "@/store/userStore";
import { Transaction } from "@/types/transaction";
import { ArrowLeft, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
// removed search debounce
import {
  useGetStatusList,
  useGetTransactionsByUser,
} from "../../hooks/useTransaction";

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

  // Filters & pagination state
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [selectedMethod, setSelectedMethod] = useState<
    "ALL_METHODS" | "MANUAL" | "DELIVERY"
  >("ALL_METHODS");
  const [selectedStatus, setSelectedStatus] = useState("ALL_STATUSES");

  const { data: statusLists } = useGetStatusList();
  const {
    data: transactionData,
    isFetching,
    isLoading,
    error,
    refetch: refetchTransactions,
  } = useGetTransactionsByUser(
    {
      page,
      limit,
      method: selectedMethod === "ALL_METHODS" ? undefined : selectedMethod,
      status: selectedStatus === "ALL_STATUSES" ? undefined : selectedStatus,
    },
    { dateRange: date },
  );

  const { setUserData } = useUserStore();
  const { getUserData, refetch } = getUser();

  const transactions: Transaction[] = transactionData?.data?.transactions || [];
  const totalPages = transactionData?.data?.totalPage || 1;

  useEffect(() => {
    const syncUser = async () => {
      const dataToSync = getUserData?.data ?? (await refetch())?.data?.data;
      if (dataToSync) {
        setUserData(dataToSync);
      }
    };

    syncUser();
  }, [getUserData, refetch, setUserData]);

  if (error) {
    refetchTransactions();
    return <LoadingAnimation message="Mencoba kembali...." />;
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

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" /> Filter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <DateRangePicker date={date} setDate={setDate} />
                <Select
                  value={selectedMethod}
                  onValueChange={(
                    value: "ALL_METHODS" | "MANUAL" | "DELIVERY",
                  ) => {
                    setSelectedMethod(value);
                    setSelectedStatus("ALL_STATUSES");
                  }}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Semua Metode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL_METHODS">Semua Metode</SelectItem>
                    <SelectItem value="MANUAL">Manual</SelectItem>
                    <SelectItem value="DELIVERY">Delivery</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                  disabled={selectedMethod === "ALL_METHODS"}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL_STATUSES">Semua Status</SelectItem>
                    {(selectedMethod === "MANUAL"
                      ? statusLists?.data.manualStatusList
                      : selectedMethod === "DELIVERY"
                        ? statusLists?.data.deliveryStatusList
                        : []
                    )?.map((status) => (
                      <SelectItem key={status} value={status}>
                        {statusConfig[status]?.label || status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Header with per-page select */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Typography variant="h4" className="font-bold">
                Daftar Transaksi ({transactions.length})
              </Typography>
            </div>
            <Select
              value={limit.toString()}
              onValueChange={(value) => setLimit(Number(value))}
              disabled={transactions.length === 0}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Pilih Jumlah Halaman" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per halaman</SelectItem>
                <SelectItem value="10">10 per halaman</SelectItem>
                <SelectItem value="20">20 per halaman</SelectItem>
                <SelectItem value="50">50 per halaman</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isLoading ? (
            <LoadingAnimation
              message="Memuat riwayat transaksi...."
              className="opacity-30 bg-background"
            />
          ) : isFetching ? (
            <LoadingAnimation
              message="Memuat riwayat transaksi...."
              className="opacity-30 bg-background"
            />
          ) : transactions.length > 0 ? (
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

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" /> Sebelumnya
              </Button>
              <span>
                Halaman {page} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Berikutnya <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TransactionHistoryList;

// Status configuration for labels (for filter display)
const statusConfig: {
  [key: string]: { label: string; color: string };
} = {
  UNPAID: {
    label: "Belum Dibayar",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  PAID: {
    label: "Dibayar",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  PROCESSING: {
    label: "Diproses",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  SHIPPED: {
    label: "Dikirim",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  DELIVERED: {
    label: "Terkirim",
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
  COMPLETE: {
    label: "Selesai",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  COMPLETED: {
    label: "Selesai",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  CANCELLED: {
    label: "Dibatalkan",
    color: "bg-red-100 text-red-800 border-red-200",
  },
};
