import { socket } from "@/lib/socket";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
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

// Helper to create query params from a DateRange object
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

// Hook for the main dashboard statistics (Revenue, Transactions, etc.)
export const useGetReportStats = ({ dateRange }: IDateFilter) => {
  const queryClient = useQueryClient();
  const queryKey = ["report-stats", dateRange];

  useEffect(() => {
    socket.connect();

    const handleNewTransaction = () => {
      toast.success("Transaksi baru diterima, laporan diperbarui!");
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
  return useQuery<IReportStats, Error>({
    queryKey: ["report-stats", dateRange],
    // Query will only run if `dateRange` has a value
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

// Hook for monthly revenue data
export const useGetMonthlyRevenue = ({ dateRange }: IDateFilter) => {
  const queryClient = useQueryClient();
  const queryKey = ["monthly-revenue", dateRange];

  useEffect(() => {
    socket.connect();
    const handleNewTransaction = () => {
      toast.success("Transaksi baru diterima, laporan diperbarui!");
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

// Hook for top-selling product distribution
export const useGetMostSoldProducts = ({ dateRange }: IDateFilter) => {
  const queryClient = useQueryClient();
  const queryKey = ["most-sold-products", dateRange];

  useEffect(() => {
    socket.connect();
    const handleNewTransaction = () => {
      toast.success("Transaksi baru diterima, laporan diperbarui!");
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
