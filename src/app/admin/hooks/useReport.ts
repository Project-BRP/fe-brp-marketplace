import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { IDateFilter } from "@/types/dateFilter";
import {
  IMonthlyRevenueResponse,
  IProductDistributionResponse,
  IReportStats,
} from "@/types/report";
import { ITransactionDateRange } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";

// Helper untuk membuat query params dari objek DateRange
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

// Hook untuk mendapatkan statistik utama (Revenue, Transactions, etc.)
export const useGetReportStats = ({ dateRange }: IDateFilter) => {
  const queryParams = createDateQueryParams(dateRange);
  return useQuery<IReportStats, Error>({
    queryKey: ["report-stats", dateRange],
    // Query hanya akan berjalan jika `dateRange` sudah ada nilainya
    enabled: !!dateRange,
    queryFn: async () => {
      const [revenueRes, transactionsRes, productsSoldRes, activeUsersRes] =
        await Promise.all([
          api.get<
            ApiResponse<{ totalRevenue: number; gainPercentage: number }>
          >(`/reports/revenue?${queryParams}`),
          api.get<
            ApiResponse<{ totalTransactions: number; gainPercentage: number }>
          >(`/reports/total-transactions?${queryParams}`),
          api.get<
            ApiResponse<{ totalProductsSold: number; gainPercentage: number }>
          >(`/reports/total-products-sold?${queryParams}`),
          api.get<
            ApiResponse<{ totalActiveUsers: number; gainPercentage: number }>
          >(`/reports/total-active-users?${queryParams}`),
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

// Hook untuk mendapatkan data pendapatan bulanan
export const useGetMonthlyRevenue = ({ dateRange }: IDateFilter) => {
  const queryParams = createDateQueryParams(dateRange);
  return useQuery<IMonthlyRevenueResponse, Error>({
    queryKey: ["monthly-revenue", dateRange],
    enabled: !!dateRange,
    queryFn: async () => {
      const res = await api.get<ApiResponse<IMonthlyRevenueResponse>>(
        `/reports/monthly-revenue?${queryParams}`,
      );
      return res.data.data;
    },
  });
};

// Hook untuk mendapatkan distribusi produk terlaris
export const useGetMostSoldProducts = ({ dateRange }: IDateFilter) => {
  const queryParams = createDateQueryParams(dateRange);
  return useQuery<IProductDistributionResponse, Error>({
    queryKey: ["most-sold-products", dateRange],
    enabled: !!dateRange,
    queryFn: async () => {
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
