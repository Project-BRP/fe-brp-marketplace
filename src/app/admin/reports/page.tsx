"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// --- Mock Data ---

// Stats for the top cards
const reportStats = {
  totalRevenue: 75250000,
  totalOrders: 480,
  totalProductsSold: 1250,
  activeCustomers: 320,
};

// Data for the monthly sales bar chart
const monthlySalesData = [
  { month: "Jan", revenue: 4500000 },
  { month: "Feb", revenue: 5200000 },
  { month: "Mar", revenue: 6800000 },
  { month: "Apr", revenue: 6100000 },
  { month: "Mei", revenue: 7300000 },
  { month: "Jun", revenue: 8100000 },
  { month: "Jul", revenue: 9500000 },
];

// Data for the top products pie chart
const topProductsData = [
  { name: "NPK 15-15-15", value: 400 },
  { name: "NPK 16-16-16", value: 300 },
  { name: "NPK 13-6-27", value: 250 },
  { name: "Lainnya", value: 300 },
];

const COLORS = ["#16a34a", "#4ade80", "#86efac", "#d1fae5"]; // Green shades

// Data for the recent transactions table
const recentTransactions = [
  {
    id: "ORD-001",
    customer: "Budi Santoso",
    date: "2024-07-20",
    amount: 1250000,
    status: "Selesai",
  },
  {
    id: "ORD-002",
    customer: "Citra Lestari",
    date: "2024-07-20",
    amount: 825000,
    status: "Diproses",
  },
  {
    id: "ORD-003",
    customer: "Dewi Anggraini",
    date: "2024-07-19",
    amount: 2500000,
    status: "Selesai",
  },
  {
    id: "ORD-004",
    customer: "Eko Prasetyo",
    date: "2024-07-19",
    amount: 150000,
    status: "Dibatalkan",
  },
];

export default function AdminReports() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Laporan Penjualan
        </h1>
        <p className="text-muted-foreground">
          Analisis performa penjualan dan data penting lainnya
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pendapatan
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(reportStats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% dari bulan lalu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{reportStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +180.1% dari bulan lalu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produk Terjual
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{reportStats.totalProductsSold}
            </div>
            <p className="text-xs text-muted-foreground">
              +19% dari bulan lalu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pelanggan Aktif
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{reportStats.activeCustomers}
            </div>
            <p className="text-xs text-muted-foreground">
              +21 sejak bulan lalu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ikhtisar Penjualan Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySalesData}>
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    `${formatCurrency(value as number)}`
                  }
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  cursor={{ fill: "rgba(110, 231, 183, 0.1)" }}
                />
                <Bar dataKey="revenue" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Produk Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProductsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {topProductsData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} unit`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaksi Terkini</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pesanan</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.id}
                  </TableCell>
                  <TableCell>{transaction.customer}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.status}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
