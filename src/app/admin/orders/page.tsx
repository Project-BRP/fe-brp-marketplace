"use client";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  Loader2,
  Package,
  Search,
  ShoppingCart,
  Truck,
} from "lucide-react";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";

import {
  useAddManualShippingCost,
  useCancelTransaction,
  useGetAllTransactions,
  useGetStatusList,
  useUpdateShippingReceipt,
  useUpdateTransactionStatus,
} from "@/app/(main)/hooks/useTransaction";
import { useResolveStockIssue } from "@/app/(main)/hooks/useTransaction";
import { Badge } from "@/components/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { DateRangePicker } from "@/components/DateRangePicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import { Input } from "@/components/InputLovable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import { Transaction } from "@/types/transaction";
import { DateRange } from "react-day-picker";
import { CancelDialog } from "./components/CancelDialog";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { ManualShippingCostDialog } from "./components/ManualShippingCostDialog";
import { ResolveStockIssueDialog } from "./components/ResolveStockIssueDialog";
import { ShippingReceiptDialog } from "./components/ShippingReceiptDialog";

// Konfigurasi untuk setiap status
const statusConfig: {
  [key: string]: { label: string; color: string; icon: React.ElementType };
} = {
  UNPAID: {
    label: "Belum Dibayar",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  PAID: {
    label: "Dibayar",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle,
  },
  PROCESSING: {
    label: "Diproses",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    icon: AlertCircle,
  },
  SHIPPED: {
    label: "Dikirim",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Truck,
  },
  DELIVERED: {
    label: "Terkirim",
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
    icon: Package,
  },
  COMPLETE: {
    label: "Selesai",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  COMPLETED: {
    // Alias untuk 'COMPLETE' agar konsisten
    label: "Selesai",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Dibatalkan",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: AlertCircle,
  },
};

export default function AdminOrders() {
  // State untuk filter dan paginasi
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [isDetailDialogOpen, setDetailDialogOpen] = useState(false);
  const [limit, setLimit] = useState(5);
  const [selectedMethod, setSelectedMethod] = useState<
    "ALL_METHODS" | "MANUAL" | "DELIVERY"
  >("ALL_METHODS");
  const [selectedStatus, setSelectedStatus] = useState("ALL_STATUSES");
  const [selectedOrder, setSelectedOrder] = useState<Transaction | null>(null);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const { mutate: cancelTransaction, isPending: isCancelling } =
    useCancelTransaction();
  const { mutate: resolveStockIssue, isPending: isResolvingStock } =
    useResolveStockIssue();
  // Fetching data
  const { data: statusLists } = useGetStatusList();
  const {
    data: transactionData,
    isLoading,
    isError,
    refetch,
  } = useGetAllTransactions(
    {
      page,
      limit,
      search: debouncedSearchTerm,
      method: selectedMethod === "ALL_METHODS" ? undefined : selectedMethod,
      status: selectedStatus === "ALL_STATUSES" ? undefined : selectedStatus,
    },
    { dateRange: date },
  );
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateTransactionStatus();
  const { mutate: addManualShippingCost, isPending: isAddingManualShipping } =
    useAddManualShippingCost();
  const { mutate: updateShippingReceipt, isPending: isUpdatingReceipt } =
    useUpdateShippingReceipt();

  const orders = transactionData?.data?.transactions ?? [];
  const totalPages = transactionData?.data?.totalPage ?? 1;
  const canBeCancelled =
    selectedOrder?.manualStatus?.toUpperCase().includes("PAID") ||
    selectedOrder?.deliveryStatus?.toUpperCase().includes("PAID");
  const canAddManualShipping =
    selectedOrder?.method === "MANUAL" &&
    ["PAID", "PROCESSING"].includes(
      (selectedOrder?.manualStatus ?? "").toUpperCase(),
    );
  const canEditReceipt =
    selectedOrder?.method === "DELIVERY" &&
    selectedOrder?.deliveryStatus === "SHIPPED";
  // Helper functions
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleStatusChange = (newStatus: string, shippingReceipt?: string) => {
    if (!selectedOrder) return;

    // Jika menggunakan dialog khusus (mis. input resi), konfirmasi sudah di-handle di dialog itu.
    // Untuk kasus umum, tetap minta konfirmasi sederhana.
    const needsSimpleConfirm = !(
      selectedOrder.method === "DELIVERY" &&
      newStatus === "SHIPPED" &&
      shippingReceipt
    );

    if (needsSimpleConfirm) {
      const confirmUpdate = window.confirm(
        "Apakah Anda yakin ingin mengupdate status?",
      );
      if (!confirmUpdate) return;
    }

    const payload =
      selectedOrder.method === "MANUAL"
        ? { manualStatus: newStatus }
        : {
            deliveryStatus: newStatus,
            ...(shippingReceipt ? { shippingReceipt } : {}),
          };

    updateStatus(
      { id: selectedOrder.id, payload },
      {
        onSuccess: () => {
          refetch();
          // Update state lokal untuk merefleksikan perubahan secara instan
          setSelectedOrder((prevOrder) =>
            prevOrder
              ? {
                  ...prevOrder,
                  ...(prevOrder.method === "MANUAL"
                    ? { manualStatus: newStatus }
                    : { deliveryStatus: newStatus }),
                }
              : null,
          );
          setDetailDialogOpen(false);
        },
      },
    );
  };

  const handleCancelTransaction = (reason: string) => {
    if (!selectedOrder) return;
    cancelTransaction(
      { transactionId: selectedOrder.id, payload: { cancelReason: reason } },
      {
        onSuccess: () => {
          setDetailDialogOpen(false);
          refetch(); // Muat ulang data transaksi untuk melihat status terbaru
        },
        onError: (err) => {
          console.error("Gagal membatalkan transaksi:", err);
          // Anda bisa menambahkan notifikasi error di sini
        },
      },
    );
  };
  const getNextStatus = (order: Transaction): string | null => {
    const currentStatus =
      order.method === "MANUAL" ? order.manualStatus : order.deliveryStatus;
    if (!currentStatus) return null;

    const statusFlow =
      order.method === "MANUAL"
        ? ["PAID", "PROCESSING", "COMPLETE"]
        : ["PAID", "SHIPPED", "DELIVERED"];

    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex > -1 && currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1];
    }
    return null;
  };

  const statusOptions =
    selectedMethod === "MANUAL"
      ? statusLists?.data.manualStatusList
      : selectedMethod === "DELIVERY"
        ? statusLists?.data.deliveryStatusList
        : [];

  // --- LOGIKA REFAKTORISASI DITERAPKAN DI SINI ---
  // Komponen kecil untuk merender bagian update status di dalam dialog
  const RenderUpdateStatusSection = ({ order }: { order: Transaction }) => {
    const status =
      order.method === "MANUAL" ? order.manualStatus : order.deliveryStatus;

    // Jangan tampilkan section ini jika status UNPAID
    if (status === "UNPAID") {
      return null;
    }

    const nextStatus = getNextStatus(order);

    // Jika tidak ada status berikutnya (sudah final)
    if (!nextStatus) {
      let badgeText = "";
      let badgeKey = "";

      if (status === "COMPLETE") {
        badgeText = "Pesanan Selesai";
        badgeKey = "COMPLETED";
      } else if (status === "DELIVERED") {
        badgeText = "Pesanan Terkirim";
        badgeKey = "DELIVERED";
      } else if (status === "CANCELLED") {
        badgeText = "Pesanan Dibatalkan";
        badgeKey = "CANCELLED";
      } else {
        // Jika status finalnya bukan salah satu di atas, jangan tampilkan apa-apa
        return null;
      }

      return (
        <Badge variant="secondary" className={statusConfig[badgeKey]?.color}>
          {badgeText}
        </Badge>
      );
    }
    // Jika ada status berikutnya, tampilkan tombol update
    const nextStatusLabel =
      statusConfig[nextStatus]?.label ?? "Status Berikutnya";

    const isDeliveryPaidToShipped =
      order.method === "DELIVERY" &&
      status === "PAID" &&
      nextStatus === "SHIPPED";

    return (
      <div className="flex items-center gap-4">
        {isDeliveryPaidToShipped ? (
          <ShippingReceiptDialog
            onSubmit={(receipt) => handleStatusChange(nextStatus, receipt)}
            isLoading={isUpdatingStatus}
            description={`Masukkan nomor resi untuk mengubah status pesanan menjadi "${nextStatusLabel}".`}
          >
            <Button size="sm" disabled={isUpdatingStatus}>
              Ubah ke {nextStatusLabel}
            </Button>
          </ShippingReceiptDialog>
        ) : (
          <ConfirmDialog
            title="Konfirmasi Update Status"
            description={`Apakah Anda yakin ingin mengubah status pesanan menjadi "${nextStatusLabel}"?`}
            onConfirm={() => handleStatusChange(nextStatus)}
            isConfirming={isUpdatingStatus}
          >
            <Button size="sm" disabled={isUpdatingStatus}>
              Ubah ke {nextStatusLabel}
            </Button>
          </ConfirmDialog>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Manajemen Pesanan
          </h1>
          <p className="text-muted-foreground">
            Kelola semua pesanan yang masuk ke toko Anda
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Pencarian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari ID pesanan atau nama pelanggan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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
                  {statusOptions?.map((status) => (
                    <SelectItem key={status} value={status}>
                      {statusConfig[status]?.label || status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <Typography variant="h4" className="font-bold">
                  Daftar Pesanan (
                  {transactionData?.data?.transactions.length || 0})
                </Typography>
              </div>
              <Select
                value={limit.toString()}
                onValueChange={(value) => setLimit(Number(value))}
                disabled={transactionData?.data?.transactions.length === 0}
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
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Pesanan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-red-500">
                      Gagal memuat data.
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Tidak ada pesanan ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => {
                    const status =
                      order.method === "MANUAL"
                        ? order.manualStatus
                        : order.deliveryStatus;
                    const config = status ? statusConfig[status] : null;
                    const StatusIcon = config?.icon;
                    const hasStockIssue = order.transactionItems?.some(
                      (it) => it.isStockIssue,
                    );

                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col gap-1">
                            {hasStockIssue && (
                              <span className="inline-block text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 w-fit">
                                Stok Bermasalah
                              </span>
                            )}
                            <span>{order.id}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.userName}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.userPhoneNumber}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.method === "MANUAL"
                                ? "secondary"
                                : "default"
                            }
                          >
                            {order.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(order.totalPrice)}
                        </TableCell>
                        <TableCell>
                          {config && (
                            <Badge variant="secondary" className={config.color}>
                              {StatusIcon && (
                                <StatusIcon className="w-3 h-3 mr-1" />
                              )}
                              {config.label}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog
                            open={
                              isDetailDialogOpen &&
                              selectedOrder?.id === order.id
                            }
                            onOpenChange={setDetailDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-lg font-black">
                                  Detail Pesanan {selectedOrder?.id}
                                </DialogTitle>
                              </DialogHeader>
                              {selectedOrder && (
                                <div className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h4 className="font-black text-lg mb-2">
                                        Informasi Pelanggan
                                      </h4>
                                      <p>
                                        <strong>Nama:</strong>{" "}
                                        {selectedOrder.userName}
                                      </p>
                                      <p>
                                        <strong>Email:</strong>{" "}
                                        {selectedOrder.userEmail}
                                      </p>
                                      <p>
                                        <strong>Telepon:</strong>{" "}
                                        {selectedOrder.userPhoneNumber}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="font-black text-lg mb-2">
                                        Alamat Pengiriman
                                      </h4>
                                      <p>
                                        {selectedOrder.shippingAddress},{" "}
                                        {selectedOrder.city},{" "}
                                        {selectedOrder.province},{" "}
                                        {selectedOrder.district},{" "}
                                        {selectedOrder.subDistrict},{" "}
                                        {selectedOrder.postalCode}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-black text-lg mb-2">
                                      Produk Dipesan
                                    </h4>
                                    <div className="space-y-2">
                                      {selectedOrder.transactionItems?.map(
                                        (item, index) => (
                                          <div
                                            key={index}
                                            className="flex justify-between items-center p-3 bg-muted rounded-lg gap-3"
                                          >
                                            <div className="flex-1">
                                              <p className="font-medium">
                                                {item.variant.product.name} (
                                                {item.variant.packaging.name})
                                              </p>
                                              <p className="text-sm text-muted-foreground">
                                                Qty: {item.quantity}
                                              </p>
                                              {item.isStockIssue && (
                                                <p className="text-xs mt-1 px-2 py-1 rounded bg-red-100 text-red-800 w-fit">
                                                  Peringatan: Item ini memiliki
                                                  masalah stok.
                                                </p>
                                              )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                              <p className="font-medium whitespace-nowrap">
                                                {formatPrice(item.priceRupiah)}
                                              </p>
                                              {item.isStockIssue && (
                                                <ResolveStockIssueDialog
                                                  isLoading={isResolvingStock}
                                                  onSubmit={(stock) => {
                                                    resolveStockIssue(
                                                      {
                                                        transactionItemId:
                                                          item.id,
                                                        stock,
                                                      },
                                                      {
                                                        onSuccess: () => {
                                                          // optimistically update selectedOrder to clear flag
                                                          setSelectedOrder(
                                                            (prev) =>
                                                              prev
                                                                ? {
                                                                    ...prev,
                                                                    transactionItems:
                                                                      prev.transactionItems?.map(
                                                                        (it) =>
                                                                          it.id ===
                                                                          item.id
                                                                            ? {
                                                                                ...it,
                                                                                isStockIssue: false,
                                                                              }
                                                                            : it,
                                                                      ),
                                                                  }
                                                                : prev,
                                                          );
                                                        },
                                                      },
                                                    );
                                                  }}
                                                >
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-red-300 text-red-700"
                                                  >
                                                    Perbaiki Stok
                                                  </Button>
                                                </ResolveStockIssueDialog>
                                              )}
                                            </div>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                    {selectedOrder.method === "DELIVERY" && (
                                      <div className="flex flex-col justify-center items-start gap-4 pt-4 w-full">
                                        <h4 className="font-black text-lg mb-2">
                                          Jasa Pengiriman
                                        </h4>
                                        <div className="flex w-full flex-col gap-2 border border-slate-400 rounded-xl p-3">
                                          <div className="flex w-full justify-between items-center">
                                            <Typography
                                              variant="p"
                                              className="font-semibold"
                                            >
                                              {selectedOrder.shippingAgent}{" "}
                                              <span className="text-sm font-normal text-muted-foreground">
                                                ({selectedOrder.shippingService}
                                                )
                                              </span>
                                            </Typography>
                                            <Typography
                                              variant="p"
                                              className="font-bold"
                                            >
                                              {formatPrice(
                                                selectedOrder.shippingCost ?? 0,
                                              )}
                                            </Typography>
                                          </div>
                                          <Typography
                                            variant="p"
                                            className="text-muted-foreground text-sm mt-1"
                                          >
                                            Estimasi:{" "}
                                            {selectedOrder.shippingEstimate}
                                          </Typography>
                                          <Typography
                                            variant="p"
                                            className="text-muted-foreground text-sm mt-1"
                                          >
                                            Nomor Resi:{" "}
                                            {selectedOrder.shippingReceipt ||
                                              "Resi Belum Diatur"}
                                          </Typography>
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex flex-col w-full gap-4">
                                      {selectedOrder.method === "MANUAL" &&
                                        selectedOrder.manualShippingCost && (
                                          <div className="flex justify-between items-center mt-4 pt-4 border-t-2">
                                            <p className="font-bold">
                                              Biaya Pengiriman Manual:
                                            </p>
                                            <p className="font-bold text-lg">
                                              {formatPrice(
                                                selectedOrder.manualShippingCost,
                                              )}
                                            </p>
                                          </div>
                                        )}
                                      <div
                                        className={`flex justify-between items-center  ${selectedOrder.method === "MANUAL" && selectedOrder.manualShippingCost ? "" : "border-t-2 mt-4 pt-4"}`}
                                      >
                                        <p className="font-bold">Total:</p>
                                        <p className="font-bold text-lg">
                                          {formatPrice(
                                            selectedOrder.totalPrice,
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center gap-4">
                                    <div>
                                      <RenderUpdateStatusSection
                                        order={selectedOrder}
                                      />
                                    </div>
                                    {canAddManualShipping && (
                                      <ManualShippingCostDialog
                                        isLoading={isAddingManualShipping}
                                        defaultCost={
                                          selectedOrder.shippingCost ??
                                          undefined
                                        }
                                        onSubmit={(cost) => {
                                          if (!selectedOrder) return;
                                          addManualShippingCost(
                                            {
                                              transactionId: selectedOrder.id,
                                              manualShippingCost: cost,
                                            },
                                            {
                                              onSuccess: () => {
                                                refetch();
                                                setSelectedOrder((prev) =>
                                                  prev
                                                    ? {
                                                        ...prev,
                                                        shippingCost: cost,
                                                      }
                                                    : prev,
                                                );
                                              },
                                            },
                                          );
                                        }}
                                      >
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          disabled={isAddingManualShipping}
                                        >
                                          Tambah Ongkir Manual
                                        </Button>
                                      </ManualShippingCostDialog>
                                    )}
                                    {canBeCancelled && (
                                      <CancelDialog
                                        onSubmit={handleCancelTransaction}
                                        isLoading={isCancelling}
                                      >
                                        <Button
                                          variant="red"
                                          size="sm"
                                          disabled={
                                            isCancelling ||
                                            selectedOrder.manualStatus ===
                                              "CANCELLED" ||
                                            selectedOrder.deliveryStatus ===
                                              "CANCELLED"
                                          }
                                        >
                                          Batalkan Transaksi
                                        </Button>
                                      </CancelDialog>
                                    )}
                                    {canEditReceipt && (
                                      <ShippingReceiptDialog
                                        title="Edit Nomor Resi"
                                        description="Masukkan nomor resi pengiriman baru untuk memperbarui resi."
                                        isLoading={isUpdatingReceipt}
                                        onSubmit={(receipt) => {
                                          if (!selectedOrder) return;
                                          updateShippingReceipt(
                                            {
                                              id: selectedOrder.id,
                                              payload: {
                                                shippingReceipt: receipt,
                                              },
                                            },
                                            {
                                              onSuccess: () => {
                                                refetch();
                                                setSelectedOrder((prev) =>
                                                  prev
                                                    ? {
                                                        ...prev,
                                                        shippingReceipt:
                                                          receipt,
                                                      }
                                                    : prev,
                                                );
                                              },
                                            },
                                          );
                                        }}
                                      >
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          disabled={isUpdatingReceipt}
                                        >
                                          Edit Nomor Resi
                                        </Button>
                                      </ShippingReceiptDialog>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
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
    </>
  );
}
