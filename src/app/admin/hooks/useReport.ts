import { socket } from "@/lib/socket";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { IDateFilter } from "@/types/dateFilter";
import {
  IMonthlyRevenueResponse,
  IProductDistributionResponse,
  IReportStats,
  ITotalActiveUsers,
  ITotalProductsSold,
  ITotalRevenue,
  ITotalTransactions,
} from "@/types/report";
import { ITransactionDateRange } from "@/types/transaction";
import { DateRange } from "react-day-picker";

// === Helper untuk query params ===
const createDateQueryParams = (dateRange?: DateRange) => {
  const params = new URLSearchParams();
  if (dateRange?.from && dateRange?.to) {
    params.append("startYear", String(dateRange.from.getFullYear()));
    params.append("startMonth", String(dateRange.from.getMonth() + 1));
    params.append("endYear", String(dateRange.to.getFullYear()));
    params.append("endMonth", String(dateRange.to.getMonth() + 1));
  }
  return params.toString();
};

// === Variabel Global untuk Socket ===
let isSocketConnected = false;
let toastShown = false;

const setupSocketListeners = (
  queryClient: QueryClient,
  queryKeys: Array<unknown[]>,
) => {
  if (isSocketConnected) return;

  isSocketConnected = true;
  socket.connect();

  const invalidateAll = () => {
    queryKeys.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: key });
    });
  };

  const handleNewTransaction = () => {
    if (!toastShown) {
      toast.success("Transaksi baru diterima, laporan diperbarui!");
      toastShown = true;
      setTimeout(() => {
        toastShown = false;
      }, 1000);
    }
    invalidateAll();
  };

  const handleUpdateTransaction = () => {
    invalidateAll();
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

// === Hook untuk Statistik Utama ===
export const useGetReportStats = ({ dateRange }: IDateFilter) => {
  const queryClient = useQueryClient();
  const queryKey: unknown[] = ["report-stats", dateRange];
  const setupRef = useRef(false);

  useEffect(() => {
    if (!setupRef.current) {
      setupSocketListeners(queryClient, [queryKey]);
      setupRef.current = true;
    }

    return () => {
      cleanupSocketListeners();
    };
  }, [queryClient, queryKey]);

  return useQuery<IReportStats, Error>({
    queryKey,
    enabled: !!dateRange,
    queryFn: async () => {
      const queryParams = createDateQueryParams(dateRange);
      const [revenueRes, transactionsRes, productsSoldRes, activeUsersRes] =
        await Promise.all([
          api.get<ApiResponse<ITotalRevenue>>(
            `/reports/revenue?${queryParams}`,
          ),
          api.get<ApiResponse<ITotalTransactions>>(
            `/reports/total-transactions?${queryParams}`,
          ),
          api.get<ApiResponse<ITotalProductsSold>>(
            `/reports/total-products-sold?${queryParams}`,
          ),
          api.get<ApiResponse<ITotalActiveUsers>>(
            `/reports/total-active-users?${queryParams}`,
          ),
        ]);

      return {
        totalRevenue: revenueRes.data.data,
        totalTransactions: transactionsRes.data.data,
        totalProductsSold: productsSoldRes.data.data,
        totalActiveUsers: activeUsersRes.data.data,
      };
    },
  });
};

// === Hook untuk Revenue Bulanan ===
export const useGetMonthlyRevenue = ({ dateRange }: IDateFilter) => {
  const queryClient = useQueryClient();
  const queryKey: unknown[] = ["monthly-revenue", dateRange];
  const setupRef = useRef(false);

  useEffect(() => {
    if (!setupRef.current) {
      setupSocketListeners(queryClient, [queryKey]);
      setupRef.current = true;
    }

    return () => {
      cleanupSocketListeners();
    };
  }, [queryClient, queryKey]);

  return useQuery<IMonthlyRevenueResponse, Error>({
    queryKey,
    enabled: !!dateRange,
    queryFn: async () => {
      const queryParams = createDateQueryParams(dateRange);
      const res = await api.get<ApiResponse<IMonthlyRevenueResponse>>(
        `/reports/monthly-revenue?${queryParams}`,
      );
      return res.data.data;
    },
  });
};

// === Hook untuk Produk Paling Laris ===
export const useGetMostSoldProducts = ({ dateRange }: IDateFilter) => {
  const queryClient = useQueryClient();
  const queryKey: unknown[] = ["most-sold-products", dateRange];
  const setupRef = useRef(false);

  useEffect(() => {
    if (!setupRef.current) {
      setupSocketListeners(queryClient, [queryKey]);
      setupRef.current = true;
    }

    return () => {
      cleanupSocketListeners();
    };
  }, [queryClient, queryKey]);

  return useQuery<IProductDistributionResponse, Error>({
    queryKey,
    enabled: !!dateRange,
    queryFn: async () => {
      const queryParams = createDateQueryParams(dateRange);
      const res = await api.get<ApiResponse<IProductDistributionResponse>>(
        `/reports/most-sold-products-distribution?${queryParams}`,
      );
      return res.data.data;
    },
  });
};

// === Hook untuk Rentang Tanggal Transaksi ===
export const useGetTransactionDateRanges = () => {
  return useQuery<ITransactionDateRange, Error>({
    queryKey: ["transaction-date-ranges"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<ITransactionDateRange>>(
        "/transactions/date-range",
      );
      return res.data.data;
    },
  });
};
