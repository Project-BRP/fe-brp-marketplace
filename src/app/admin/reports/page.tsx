"use client";
import { useGetAllTransactions } from "@/app/(main)/hooks/useTransaction";
import {
  useGetMonthlyRevenue,
  useGetMostSoldProducts,
  useGetReportStats,
} from "@/app/admin/hooks/useReport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { MonthRangePicker } from "@/components/MonthRangePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { Skeleton } from "@/components/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { addMonths, startOfMonth } from "date-fns";
import {
  DollarSign,
  Loader2,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#16a34a", "#4ade80", "#86efac", "#d1fae5", "#6ee7b7"];
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Ags", "Sep", "Okt", "Nov", "Des",
];

/* ---------------------- Custom Tooltip PieChart ---------------------- */
type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
  totalSold: number;
};
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, totalSold }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    const percentage = totalSold > 0 ? ((value / totalSold) * 100).toFixed(1) : 0;
    return (
      <div className="rounded-md border bg-background p-2 shadow-sm">
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">
          Terjual: {value} unit ({percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

/* ---------------------- Custom Tooltip LineChart ---------------------- */
type LineTooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number; payload: any }>;
  label?: string;
};

const CustomLineTooltip: React.FC<LineTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const revenueValue = payload[0].value;
    const gainPercentageValue = payload[0].payload.gainPercentage;

    return (
      <div className="rounded-md border bg-background p-2 shadow-sm">
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-muted-foreground">
          Pendapatan: {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(revenueValue)}
        </p>
        <p className={`text-sm ${gainPercentageValue > 0 ? "text-green-600" : gainPercentageValue < 0 ? "text-red-600" : "text-gray-500"}`}>
          Perubahan: {gainPercentageValue ?? 0}%
        </p>
      </div>
    );
  }
  return null;
};

/* ---------------------- Fungsi Warna KPI ---------------------- */
const getGainColor = (gain: number | undefined) => {
  if (!gain || gain === 0) return "text-gray-500";
  if (gain > 0) return "text-green-600";
  return "text-red-600";
};

export default function AdminReports() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startOfMonth(addMonths(new Date(), -12)),
    to: new Date(),
  });
  const [topProductsLimit, setTopProductsLimit] = React.useState<number>(5);

  // Fetch data
  const { data: reportStats, isLoading: isLoadingStats } = useGetReportStats({ dateRange: date });
  const { data: monthlyRevenueData, isLoading: isLoadingMonthlyRevenue } = useGetMonthlyRevenue({ dateRange: date });
  const { data: topProductsData, isLoading: isLoadingTopProducts } = useGetMostSoldProducts({ dateRange: date });
  const { data: transactionData, isLoading: isLoadingTransactions } = useGetAllTransactions(
    { page: 1, limit: 5 },
    { dateRange: date }
  );

  // Format mata uang
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

  // Format sumbu Y agar singkat (dalam Ribu / Juta)
  const formatAxisCurrency = (tickItem: number) => {
    if (tickItem >= 1000000) return `${(tickItem / 1000000).toFixed(1).replace(/\.0$/, "")} Jt`;
    if (tickItem >= 1000) return `${(tickItem / 1000).toFixed(0)} Rb`;
    return tickItem.toString();
  };

  // Siapkan data bulanan dengan gainPercentage
  const formattedMonthlyData = monthlyRevenueData?.revenues.map((item) => ({
    ...item,
    month: `${MONTH_NAMES[item.month - 1]} ${String(item.year).slice(-2)}`,
    gainPercentage: item.gainPercentage,
  }));

  const filteredTopProducts = topProductsData?.products.slice(0, topProductsLimit);

  const totalProductsSoldInChart = React.useMemo(() =>
    filteredTopProducts?.reduce((sum, item) => sum + item.totalSold, 0) || 0,
  [filteredTopProducts]);

  const recentTransactions = transactionData?.data?.transactions ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Laporan Penjualan</h1>
          <p className="text-muted-foreground">Analisis performa penjualan dan data penting lainnya</p>
        </div>
        <MonthRangePicker date={date} setDate={setDate} onInitialDateSet={setDate} />
      </div>

      {/* KPI */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoadingStats ? (
          <>
            <Skeleton className="h-28" /><Skeleton className="h-28" />
            <Skeleton className="h-28" /><Skeleton className="h-28" />
          </>
        ) : (
          <>
            {/* Total Pendapatan */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(reportStats?.totalRevenue.totalRevenue ?? 0)}
                </div>
                <p className={`text-xs ${getGainColor(reportStats?.totalRevenue.gainPercentage)}`}>
                  {reportStats?.totalRevenue.gainPercentage ?? 0}% dari bulan lalu
                </p>
              </CardContent>
            </Card>

            {/* Total Pesanan */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reportStats?.totalTransactions.totalTransactions ?? 0}
                </div>
                <p className={`text-xs ${getGainColor(reportStats?.totalTransactions.gainPercentage)}`}>
                  {reportStats?.totalTransactions.gainPercentage ?? 0}% dari bulan lalu
                </p>
              </CardContent>
            </Card>

            {/* Produk Terjual */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produk Terjual</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reportStats?.totalProductsSold.totalProductsSold ?? 0}
                </div>
                <p className={`text-xs ${getGainColor(reportStats?.totalProductsSold.gainPercentage)}`}>
                  {reportStats?.totalProductsSold.gainPercentage ?? 0}% dari bulan lalu
                </p>
              </CardContent>
            </Card>

            {/* Pelanggan Aktif */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pelanggan Aktif</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reportStats?.totalActiveUsers.totalActiveUsers ?? 0}
                </div>
                <p className={`text-xs ${getGainColor(reportStats?.totalActiveUsers.gainPercentage)}`}>
                  {reportStats?.totalActiveUsers.gainPercentage ?? 0}% sejak bulan lalu
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Line Chart */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trend Penjualan Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {isLoadingMonthlyRevenue ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <LineChart data={formattedMonthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false}/>
                  <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false}
                    tickFormatter={(value) => formatAxisCurrency(value as number)}
                    domain={[0, "dataMax + 1000000"]}/>
                  <Tooltip content={<CustomLineTooltip />} cursor={{ fill: "rgba(110, 231, 183, 0.1)" }}/>
                  <Line type="monotone" dataKey="totalRevenue" stroke="#16a34a"
                    strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }}/>
                </LineChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Distribusi Produk Terlaris</CardTitle>
            <Select value={String(topProductsLimit)} onValueChange={(value) => setTopProductsLimit(Number(value))}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Tampilkan Top 5" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Top 3</SelectItem>
                <SelectItem value="5">Top 5</SelectItem>
                <SelectItem value="10">Top 10</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {isLoadingTopProducts ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <PieChart>
                  <Pie data={filteredTopProducts} cx="40%" cy="50%" innerRadius={50}
                    outerRadius={80} paddingAngle={2} dataKey="totalSold" nameKey="name"
                    labelLine={false} label={false}>
                    {filteredTopProducts?.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip totalSold={totalProductsSoldInChart} />} />
                  <Legend align="right" verticalAlign="middle" layout="vertical"
                    wrapperStyle={{ lineHeight: "24px", paddingLeft: "10px" }}
                    formatter={(value) => value.length > 25 ? `${value.substring(0, 22)}...` : value}/>
                </PieChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Transaksi */}
      <Card>
        <CardHeader><CardTitle>Transaksi Terkini</CardTitle></CardHeader>
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
              {isLoadingTransactions ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : (
                recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.userName}</TableCell>
                    <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{transaction.deliveryStatus || transaction.manualStatus}</TableCell>
                    <TableCell className="text-right">{formatCurrency(transaction.totalPrice)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
