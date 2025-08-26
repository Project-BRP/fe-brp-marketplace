import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {
  IProductDistributionResponse,
  ICurrentMonthTotalRevenue,
  ITodayTotalTransactions,
  ITotalProducts,
  ITotalActiveUsers,
} from "@/types/report";
import { TransactionsResponseData } from "@/types/transaction";
import { useEffect } from "react";
import { socket } from "@/lib/socket";
import toast from "react-hot-toast";

interface IDashboardStats {
  todayTransactions: ITodayTotalTransactions;
  currentMonthRevenue: ICurrentMonthTotalRevenue;
  totalProducts: ITotalProducts;
  totalActiveUsers: ITotalActiveUsers;
}

// Hook untuk Statistik Utama Dasbor
export const useGetDashboardStats = () => {
  return useQuery<IDashboardStats, Error>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [
        todayTransactionsRes,
        currentMonthRevenueRes,
        totalProductsRes,
        totalActiveUsersRes,
      ] = await Promise.all([
        api.get<ApiResponse<ITodayTotalTransactions>>(
          "/reports/today-total-transactions"
        ),
        api.get<ApiResponse<ICurrentMonthTotalRevenue>>(
          "/reports/current-month-revenue"
        ),
        api.get<ApiResponse<ITotalProducts>>("/reports/total-products"),
        api.get<ApiResponse<ITotalActiveUsers>>("/reports/total-active-users"),
      ]);

      return {
        todayTransactions: todayTransactionsRes.data.data,
        currentMonthRevenue: currentMonthRevenueRes.data.data,
        totalProducts: totalProductsRes.data.data,
        totalActiveUsers: totalActiveUsersRes.data.data,
      };
    },
  });
};

// Hook untuk Produk Terlaris
export const useGetTopProducts = () => {
  return useQuery<IProductDistributionResponse, Error>({
    queryKey: ["dashboard-top-products"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<IProductDistributionResponse>>(
        "/reports/most-sold-products-distribution"
      );
      return res.data.data;
    },
  });
};

// Hook untuk Pesanan Terbaru
export const useGetRecentOrders = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.connect();

    const handleNewTransaction = () => {
      toast.success("Pesanan baru diterima!");
      queryClient.invalidateQueries({ queryKey: ["dashboard-recent-orders"] });
    };

    const handleUpdateTransaction = () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-recent-orders"] });
    };

    socket.on("newTransaction", handleNewTransaction);
    socket.on("transactions", handleUpdateTransaction);

    return () => {
      socket.off("newTransaction", handleNewTransaction);
      socket.off("transactions", handleUpdateTransaction);
      socket.disconnect();
    };
  }, [queryClient]);

  return useQuery<TransactionsResponseData, Error>({
    queryKey: ["dashboard-recent-orders"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<TransactionsResponseData>>(
        `/transactions?limit=5`
      );
      return res.data.data;
    },
  });
};
