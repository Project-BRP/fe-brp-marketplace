"use client";
import { Badge } from "@/components/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
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
import Button from "@/components/buttons/Button";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  Search,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useState } from "react";

// Mock data pesanan
const orders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    customer: "Tani Sukses",
    email: "tani@sukses.com",
    phone: "081234567890",
    products: [{ name: "NPK 15-15-15", qty: 5, price: 150000 }],
    total: 750000,
    status: "pending",
    address: "Jl. Pertanian No. 123, Bandung",
  },
  {
    id: "ORD-002",
    date: "2024-01-15",
    customer: "Agro Makmur",
    email: "info@agromakmur.com",
    phone: "081987654321",
    products: [{ name: "NPK 16-16-16", qty: 3, price: 165000 }],
    total: 495000,
    status: "processing",
    address: "Jl. Sawah Raya No. 45, Jakarta",
  },
  {
    id: "ORD-003",
    date: "2024-01-14",
    customer: "Petani Jaya",
    email: "jaya@petani.com",
    phone: "081234509876",
    products: [{ name: "NPK 13-6-27", qty: 8, price: 140000 }],
    total: 1120000,
    status: "shipped",
    address: "Jl. Ladang Indah No. 67, Surabaya",
  },
  {
    id: "ORD-004",
    date: "2024-01-14",
    customer: "Sumber Tani",
    email: "sumber@tani.co.id",
    phone: "081567890123",
    products: [{ name: "NPK 12-12-17", qty: 2, price: 135000 }],
    total: 270000,
    status: "completed",
    address: "Jl. Panen Raya No. 89, Medan",
  },
  {
    id: "ORD-005",
    date: "2024-01-13",
    customer: "Kebun Mawar",
    email: "kebun@mawar.com",
    phone: "081345678901",
    products: [{ name: "NPK 13-8-27-4", qty: 4, price: 160000 }],
    total: 640000,
    status: "processing",
    address: "Jl. Bunga Indah No. 12, Yogyakarta",
  },
];

const statusOptions = [
  "Semua",
  "pending",
  "processing",
  "shipped",
  "completed",
];

const statusConfig = {
  pending: {
    label: "Menunggu",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  processing: {
    label: "Diproses",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: AlertCircle,
  },
  shipped: {
    label: "Dikirim",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Truck,
  },
  completed: {
    label: "Selesai",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
};

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  type Order = (typeof orders)[number];
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "Semua" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = {
      pending: "processing",
      processing: "shipped",
      shipped: "completed",
      completed: "completed",
    };
    return statusFlow[currentStatus as keyof typeof statusFlow];
  };

  const getNextStatusLabel = (currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus);
    if (nextStatus === currentStatus) return null;
    return statusConfig[nextStatus as keyof typeof statusConfig]?.label;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Manajemen Pesanan
        </h1>
        <p className="text-muted-foreground">
          Kelola semua pesanan yang masuk ke toko Anda
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari berdasarkan ID pesanan atau nama pelanggan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "Semua"
                      ? status
                      : statusConfig[status as keyof typeof statusConfig]
                          ?.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Daftar Pesanan ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pesanan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const StatusIcon =
                  statusConfig[order.status as keyof typeof statusConfig]?.icon;
                const statusColor =
                  statusConfig[order.status as keyof typeof statusConfig]
                    ?.color;
                const statusLabel =
                  statusConfig[order.status as keyof typeof statusConfig]
                    ?.label;

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{formatDate(order.date)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColor}>
                        {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                        {statusLabel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
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
                              <DialogTitle>
                                Detail Pesanan {selectedOrder?.id}
                              </DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-6">
                                {/* Customer Info */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">
                                      Informasi Pelanggan
                                    </h4>
                                    <p>
                                      <strong>Nama:</strong>{" "}
                                      {selectedOrder.customer}
                                    </p>
                                    <p>
                                      <strong>Email:</strong>{" "}
                                      {selectedOrder.email}
                                    </p>
                                    <p>
                                      <strong>Telepon:</strong>{" "}
                                      {selectedOrder.phone}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">
                                      Alamat Pengiriman
                                    </h4>
                                    <p>{selectedOrder.address}</p>
                                  </div>
                                </div>

                                {/* Products */}
                                <div>
                                  <h4 className="font-medium mb-2">
                                    Produk Dipesan
                                  </h4>
                                  <div className="space-y-2">
                                    {selectedOrder.products.map(
                                      (
                                        product: Order["products"][number],
                                        index: number,
                                      ) => (
                                        <div
                                          key={index}
                                          className="flex justify-between items-center p-3 bg-muted rounded-lg"
                                        >
                                          <div>
                                            <p className="font-medium">
                                              {product.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                              Quantity: {product.qty} karung
                                            </p>
                                          </div>
                                          <p className="font-medium">
                                            {formatPrice(
                                              product.price * product.qty,
                                            )}
                                          </p>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                    <p className="font-bold">Total:</p>
                                    <p className="font-bold text-lg">
                                      {formatPrice(selectedOrder.total)}
                                    </p>
                                  </div>
                                </div>

                                {/* Status Update */}
                                <div>
                                  <h4 className="font-medium mb-2">
                                    Update Status
                                  </h4>
                                  <div className="flex items-center gap-4">
                                    <Badge
                                      variant="secondary"
                                      className={
                                        statusConfig[
                                          selectedOrder.status as keyof typeof statusConfig
                                        ]?.color
                                      }
                                    >
                                      {
                                        statusConfig[
                                          selectedOrder.status as keyof typeof statusConfig
                                        ]?.label
                                      }
                                    </Badge>
                                    {getNextStatusLabel(
                                      selectedOrder.status,
                                    ) && (
                                      <Button
                                        size="sm"
                                        className="flex items-center gap-2"
                                      >
                                        Ubah ke{" "}
                                        {getNextStatusLabel(
                                          selectedOrder.status,
                                        )}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {getNextStatusLabel(order.status) && (
                          <Button size="sm" variant="outline">
                            Update
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
