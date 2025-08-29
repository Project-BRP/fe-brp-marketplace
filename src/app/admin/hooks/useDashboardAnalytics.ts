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
import type { QueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

interface IDashboardStats {
  todayTransactions: ITodayTotalTransactions;
  currentMonthRevenue: ICurrentMonthTotalRevenue;
  totalProducts: ITotalProducts;
  totalActiveUsers: ITotalActiveUsers;
}

// Variable global untuk mencegah toast duplikat
let isSocketConnected = false;
let toastShown = false;

const setupSocketListeners = (queryClient: QueryClient) => {
  if (isSocketConnected) return;

  isSocketConnected = true;
  socket.connect();

  const handleNewTransaction = () => {
    // Hanya tampilkan toast jika belum ditampilkan untuk event ini
    if (!toastShown) {
      toast.success("Transaksi baru diterima!");
      toastShown = true;

      // Reset flag setelah 1 detik untuk mencegah spam
      setTimeout(() => {
        toastShown = false;
      }, 1000);
    }

    // Invalidate semua query terkait dashboard
    queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-top-products"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-recent-orders"] });
  };

  const handleUpdateTransaction = () => {
    // Invalidate semua query terkait dashboard
    queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-top-products"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-recent-orders"] });
  };

  socket.on("newTransaction", handleNewTransaction);
  socket.on("transactions", handleUpdateTransaction);
};

const cleanupSocketListeners = () => {
  if (isSocketConnected) {
    socket.off("newTransaction");
    socket.off("transactions");
    socket.disconnect();
    isSocketConnected = false;
  }
};

// Hook untuk Statistik Utama Dasbor
export const useGetDashboardStats = () => {
  const queryClient = useQueryClient();
  const queryKey = ["dashboard-stats"];
  const setupRef = useRef(false);

  useEffect(() => {
    if (!setupRef.current) {
      setupSocketListeners(queryClient);
      setupRef.current = true;
    }

    return () => {
      // Cleanup hanya saat komponen terakhir unmount
      cleanupSocketListeners();
    };
  }, [queryClient]);

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
  const queryKey = ["dashboard-top-products"];

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
