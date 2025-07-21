import { Badge } from "@/components/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import Button from "@/components/buttons/Button";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

const statsCards = [
  {
    title: "Pesanan Hari Ini",
    value: "12",
    change: "+8 dari kemarin",
    icon: ShoppingCart,
    trend: "up",
  },
  {
    title: "Penjualan Bulan Ini",
    value: "Rp 45.2M",
    change: "+12% dari bulan lalu",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "Total Produk",
    value: "24",
    change: "8 kategori NPK",
    icon: Package,
    trend: "neutral",
  },
  {
    title: "Pelanggan Aktif",
    value: "156",
    change: "+23 bulan ini",
    icon: Users,
    trend: "up",
  },
];

const topProducts = [
  { name: "NPK 15-15-15", sales: 45, stock: 120 },
  { name: "NPK 16-16-16", sales: 38, stock: 95 },
  { name: "NPK 13-6-27", sales: 32, stock: 78 },
  { name: "NPK 12-12-17", sales: 28, stock: 156 },
  { name: "NPK 13-8-27-4", sales: 22, stock: 89 },
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Tani Sukses",
    products: "NPK 15-15-15 (5 karung)",
    amount: "Rp 750.000",
    status: "pending",
  },
  {
    id: "ORD-002",
    customer: "Agro Makmur",
    products: "NPK 16-16-16 (3 karung)",
    amount: "Rp 480.000",
    status: "processing",
  },
  {
    id: "ORD-003",
    customer: "Petani Jaya",
    products: "NPK 13-6-27 (8 karung)",
    amount: "Rp 1.200.000",
    status: "shipped",
  },
  {
    id: "ORD-004",
    customer: "Sumber Tani",
    products: "NPK 12-12-17 (2 karung)",
    amount: "Rp 320.000",
    status: "completed",
  },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
};

const statusIcons = {
  pending: Clock,
  processing: AlertCircle,
  shipped: TrendingUp,
  completed: CheckCircle,
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali! Berikut ringkasan toko Anda hari ini.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
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
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Produk Terlaris
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {product.sales} terjual bulan ini
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      Stok: {product.stock}
                    </p>
                    <Badge
                      variant={product.stock > 50 ? "default" : "destructive"}
                    >
                      {product.stock > 50 ? "Tersedia" : "Terbatas"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Pesanan Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order, index) => {
                const StatusIcon =
                  statusIcons[order.status as keyof typeof statusIcons];
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-foreground">
                          {order.id}
                        </p>
                        <Badge
                          variant="secondary"
                          className={
                            statusColors[
                              order.status as keyof typeof statusColors
                            ]
                          }
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.customer}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.products}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        {order.amount}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary"
                      >
                        Detail
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Tambah Produk Baru
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Lihat Semua Pesanan
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Laporan Penjualan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
