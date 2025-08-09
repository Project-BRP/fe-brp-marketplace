// src/app/(main)/hooks/useTransaction.ts

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import api from "@/lib/api";
import useUserStore from "@/store/userStore";
import { ApiResponse } from "@/types/api";
import {
  CreateTransactionData,
  CreateTransactionResponse,
  GetTransactionsResponse,
  StatusListResponse,
} from "@/types/transaction";

// Hook untuk membuat transaksi baru
export const useCreateTransaction = () => {
  return useMutation<CreateTransactionResponse, Error, CreateTransactionData>({
    mutationFn: async (data) => {
      const res = await api.post("/transactions", data);
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res.message);
      // Redirect ke halaman pembayaran Midtrans
      if (res.data.snapUrl) {
        window.location.href = res.data.snapUrl;
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message || "Gagal membuat transaksi");
    },
  });
};

// Hook untuk mendapatkan semua transaksi oleh pengguna
export const useGetTransactions = () => {
  const { userData } = useUserStore();
  return useQuery<GetTransactionsResponse, Error>({
    queryKey: ["transactions", userData?.userId],
    queryFn: async () => {
      if (!userData?.userId) throw new Error("User tidak ditemukan");
      const res = await api.get(`/transactions/user/${userData.userId}`);
      return res.data;
    },
    enabled: !!userData?.userId, // Query hanya akan berjalan jika user.id dan token ada
  });
};

export const useGetStatusList = () => {
  return useQuery<ApiResponse<StatusListResponse>, Error>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await api.get(`/transactions/status-list`);
      return res.data;
    },
  });
};
