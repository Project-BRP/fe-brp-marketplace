import api from "@/lib/api";
import { socket } from "@/lib/socket";
import { ApiResponse } from "@/types/api";
import {
  ICurrentMonthTotalRevenue,
  IProductDistributionResponse,
  ITodayTotalTransactions,
  ITotalActiveUsers,
  ITotalProducts,
} from "@/types/report";
import { TransactionsResponseData } from "@/types/transaction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";

interface IDashboardStats {
  todayTransactions: ITodayTotalTransactions;
  currentMonthRevenue: ICurrentMonthTotalRevenue;
  totalProducts: ITotalProducts;
  totalActiveUsers: ITotalActiveUsers;
}

// Hook untuk Statistik Utama Dasbor
export const useGetDashboardStats = () => {
  const queryClient = useQueryClient();
  const queryKey = ["dashboard-stats"];

  useEffect(() => {
    socket.connect();

    const handleNewTransaction = () => {
      toast.success("Transaksi baru diterima!");
      queryClient.invalidateQueries({ queryKey });
    };

    const handleUpdateTransaction = () => {
      queryClient.invalidateQueries({ queryKey });
    };

    socket.on("newTransaction", handleNewTransaction);
    socket.on("transactions", handleUpdateTransaction);

    return () => {
      socket.off("newTransaction", handleNewTransaction);
      socket.off("transactions", handleUpdateTransaction);
      socket.disconnect();
    };
  }, [queryClient, queryKey]);

  return useQuery<IDashboardStats, Error>({
    queryKey,
    queryFn: async () => {
      const [
        todayTransactionsRes,
        currentMonthRevenueRes,
        totalProductsRes,
        totalActiveUsersRes,
      ] = await Promise.all([
        api.get<ApiResponse<ITodayTotalTransactions>>(
          "/reports/today-total-transactions",
        ),
        api.get<ApiResponse<ICurrentMonthTotalRevenue>>(
          "/reports/current-month-revenue",
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
  const queryClient = useQueryClient();
  const queryKey = ["dashboard-top-products"];

  useEffect(() => {
    socket.connect();

    const handleNewTransaction = () => {
      toast.success("Transaksi baru diterima!");
      queryClient.invalidateQueries({ queryKey });
    };

    const handleUpdateTransaction = () => {
      queryClient.invalidateQueries({ queryKey });
    };

    socket.on("newTransaction", handleNewTransaction);
    socket.on("transactions", handleUpdateTransaction);

    return () => {
      socket.off("newTransaction", handleNewTransaction);
      socket.off("transactions", handleUpdateTransaction);
      socket.disconnect();
    };
  }, [queryClient, queryKey]);

  return useQuery<IProductDistributionResponse, Error>({
    queryKey,
    queryFn: async () => {
      const res = await api.get<ApiResponse<IProductDistributionResponse>>(
        "/reports/most-sold-products-distribution",
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
      toast.success("Transaksi baru diterima!");
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
        `/transactions?limit=5`,
      );
      return res.data.data;
    },
  });
};
