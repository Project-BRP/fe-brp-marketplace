"use client";

import {
  useCancelTransaction,
  useUpdateTransactionStatus,
} from "@/app/(main)/hooks/useTransaction";
import {
  useGetDashboardStats,
  useGetRecentOrders,
  useGetTopProducts,
} from "@/app/admin/hooks/useDashboardAnalytics";
import { CancelDialog } from "@/app/admin/orders/components/CancelDialog";
import { ConfirmDialog } from "@/app/admin/orders/components/ConfirmDialog";
import { ShippingReceiptDialog } from "@/app/admin/orders/components/ShippingReceiptDialog";
import { Badge } from "@/components/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";
import { Skeleton } from "@/components/Skeleton";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import clsxm from "@/lib/clsxm";
import { Transaction, TransactionItem } from "@/types/transaction";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import React, { useState } from "react";

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

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

// Komponen untuk dialog detail pesanan
const OrderDetailDialog = ({
  order,
  open,
  onOpenChange,
}: {
  order: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateTransactionStatus();
  const { mutate: cancelTransaction, isPending: isCancelling } =
    useCancelTransaction();

  const handleStatusChange = (newStatus: string, shippingReceipt?: string) => {
    if (!order) return;

    const needsSimpleConfirm = !(
      order.method === "DELIVERY" &&
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
      order.method === "MANUAL"
        ? { manualStatus: newStatus }
        : {
            deliveryStatus: newStatus,
            ...(shippingReceipt ? { shippingReceipt } : {}),
          };

    updateStatus(
      { id: order.id, payload },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const handleCancelTransaction = (reason: string) => {
    if (!order) return;
    cancelTransaction(
      { transactionId: order.id, payload: { cancelReason: reason } },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
        onError: (err) => {
          console.error("Gagal membatalkan transaksi:", err);
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

  const canBeCancelled =
    order?.manualStatus?.toUpperCase().includes("PAID") ||
    order?.deliveryStatus?.toUpperCase().includes("PAID");

  const RenderUpdateStatusSection = ({ order }: { order: Transaction }) => {
    const status =
      order.method === "MANUAL" ? order.manualStatus : order.deliveryStatus;

    if (status === "UNPAID") {
      return null;
    }

    const nextStatus = getNextStatus(order);

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
        return null;
      }

      return (
        <Badge variant="secondary" className={statusConfig[badgeKey]?.color}>
          {badgeText}
        </Badge>
      );
    }

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-black">
            Detail Pesanan {order?.id}
          </DialogTitle>
        </DialogHeader>
        {order && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-black text-lg mb-2">Informasi Pelanggan</h4>
                <p>
                  <strong>Nama:</strong> {order.userName}
                </p>
                <p>
                  <strong>Email:</strong> {order.userEmail}
                </p>
                <p>
                  <strong>Telepon:</strong> {order.userPhoneNumber}
                </p>
              </div>
              <div>
                <h4 className="font-black text-lg mb-2">Alamat Pengiriman</h4>
                <p>
                  {order.shippingAddress}, {order.city}, {order.province},{" "}
                  {order.district}, {order.subDistrict}, {order.postalCode}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-black text-lg mb-2">Produk Dipesan</h4>
              <div className="space-y-2">
                {order.transactionItems?.map(
                  (item: TransactionItem, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {item.variant.product.name} (
                          {item.variant.packaging.name})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatPrice(item.priceRupiah)}
                      </p>
                    </div>
                  ),
                )}
              </div>

              {order.method === "DELIVERY" && (
                <div className="flex flex-col justify-center items-start gap-4 pt-4 w-full">
                  <h4 className="font-black text-lg mb-2">Jasa Pengiriman</h4>
                  <div className="flex w-full flex-col gap-2 border border-slate-400 rounded-xl p-3">
                    <div className="flex w-full justify-between items-center">
                      <Typography variant="p" className="font-semibold">
                        {order.shippingAgent}{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                          ({order.shippingService})
                        </span>
                      </Typography>
                      <Typography variant="p" className="font-bold">
                        {formatPrice(order.shippingCost ?? 0)}
                      </Typography>
                    </div>
                    <Typography
                      variant="p"
                      className="text-muted-foreground text-sm mt-1"
                    >
                      Estimasi: {order.shippingEstimate}
                    </Typography>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <p className="font-bold">Total:</p>
                <p className="font-bold text-lg">
                  {formatPrice(order.totalPrice)}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <RenderUpdateStatusSection order={order} />
              </div>
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
                      order.manualStatus === "CANCELLED" ||
                      order.deliveryStatus === "CANCELLED"
                    }
                  >
                    Batalkan Transaksi
                  </Button>
                </CancelDialog>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default function AdminDashboard() {
  const { data: statsData, isLoading: isLoadingStats } = useGetDashboardStats();
  const {
    data: topProductsData,
    isLoading: isLoadingTopProducts,
    isError: isErrorTopProducts,
  } = useGetTopProducts();
  const {
    data: recentOrdersData,
    isLoading: isLoadingRecentOrders,
    isError: isErrorRecentOrders,
  } = useGetRecentOrders();

  // State untuk dialog detail
  const [selectedOrder, setSelectedOrder] = useState<Transaction | null>(null);
  const [isDetailDialogOpen, setDetailDialogOpen] = useState(false);

  const statsCards = [
    {
      title: "Pesanan Hari Ini",
      value: statsData?.todayTransactions.totalTransactions ?? "0",
      change: `${statsData?.todayTransactions.gainPercentage ?? 0}% dari kemarin`,
      icon: ShoppingCart,
      trend:
        (statsData?.todayTransactions.gainPercentage ?? 0) >= 0 ? "up" : "down",
    },
    {
      title: "Penjualan Bulan Ini",
      value: formatPrice(statsData?.currentMonthRevenue.totalRevenue ?? 0),
      change: `${statsData?.currentMonthRevenue.gainPercentage ?? 0}% dari bulan lalu`,
      icon: DollarSign,
      trend:
        (statsData?.currentMonthRevenue.gainPercentage ?? 0) >= 0
          ? "up"
          : "down",
    },
    {
      title: "Total Produk",
      value: statsData?.totalProducts.totalProducts ?? "0",
      icon: Package,
      trend: "neutral",
    },
    {
      title: "Pelanggan Aktif",
      value: statsData?.totalActiveUsers.totalActiveUsers ?? "0",
      change: `${(statsData?.totalActiveUsers.gain ?? 0) >= 0 ? "+" : ""}${statsData?.totalActiveUsers.gain ?? 0} bulan ini`,
      icon: Users,
      trend: (statsData?.totalActiveUsers.gain ?? 0) >= 0 ? "up" : "down",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali! Berikut ringkasan toko Anda hari ini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoadingStats
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/2 mb-2" />
                  <Skeleton className="h-3 w-1/3" />
                </CardContent>
              </Card>
            ))
          : statsCards.map((stat, index) => (
              <Card key={index} className="hover:shadow-card transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      stat.trend === "up"
                        ? "text-green-600"
                        : stat.trend === "down"
                          ? "text-red-600"
                          : "text-muted-foreground"
                    }`}
                  >
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Produk Terlaris
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingTopProducts ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))
              ) : isErrorTopProducts ? (
                <p className="text-red-500">Gagal memuat produk terlaris.</p>
              ) : (
                topProductsData?.products.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-bold text-foreground">
                        {product.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Terjual bulan ini: {product.currentMonthSold}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">
                        {product.totalSold}
                      </p>
                      <p className="text-sm text-muted-foreground">Terjual</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Pesanan Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 relative w-full">
              {isLoadingRecentOrders ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full" />
                ))
              ) : isErrorRecentOrders ? (
                <p className="text-red-500">Gagal memuat pesanan terbaru.</p>
              ) : (
                recentOrdersData?.transactions.map((order) => {
                  const status =
                    order.deliveryStatus ?? order.manualStatus ?? "N/A";
                  const config = status ? statusConfig[status] : null;
                  const StatusIcon = config?.icon;
                  return (
                    <div
                      key={order.id}
                      className="w-full flex justify-between items-start  p-3 rounded-lg bg-muted/50 gap-8"
                    >
                      <div className="flex flex-col w-[40%] sm:w-[70%] lg:w-[50%] xl:w-[70%]">
                        <p className="font-medium text-foreground pb-1 truncate">
                          {order.id}
                        </p>
                        {config && (
                          <Badge
                            variant="secondary"
                            className={clsxm(config.color, "w-fit")}
                          >
                            {StatusIcon && (
                              <StatusIcon className="w-3 h-3 mr-1" />
                            )}
                            {config.label}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground text-sm sm:text-base">
                          {formatPrice(order.totalPrice)}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-primary border-green-400"
                          onClick={() => {
                            setSelectedOrder(order);
                            setDetailDialogOpen(true);
                          }}
                        >
                          Detail
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog untuk detail pesanan */}
      {selectedOrder && (
        <OrderDetailDialog
          order={selectedOrder}
          open={isDetailDialogOpen}
          onOpenChange={setDetailDialogOpen}
        />
      )}
    </div>
  );
}
