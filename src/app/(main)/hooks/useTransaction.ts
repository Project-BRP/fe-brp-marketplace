// src/app/(main)/hooks/useTransaction.ts

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import api from "@/lib/api";
import useUserStore from "@/store/userStore";
import { ApiResponse } from "@/types/api";
import {
  CancelTransactionData,
  CancelTransactionResponse,
  CreateTransactionData,
  CreateTransactionResponse,
  GetTransactionsResponse,
  StatusListResponse,
  Transaction,
} from "@/types/transaction";
import { useRouter } from "next/navigation";

// Hook untuk membuat transaksi baru
export const useCreateTransaction = () => {
  const router = useRouter();
  return useMutation<CreateTransactionResponse, Error, CreateTransactionData>({
    mutationFn: async (data) => {
      const res = await api.post("/transactions", data);
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res.message);
      // Redirect ke halaman pembayaran Midtrans
      if (res.data.snapUrl) {
        router.push("/transactions?transaction_id=" + res.data.id);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Gagal membuat transaksi");
    },
  });
};

export const useCancelTransaction = () => {
  return useMutation<CancelTransactionResponse, Error, CancelTransactionData>({
    mutationFn: async (variables) => {
      const { transactionId, payload } = variables;
      const res = await api.post(
        `/transactions/${transactionId}/cancel`,
        payload,
      );
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Transaksi berhasil dibatalkan.");
    },
    onError: (error) => {
      const errorMessage = error.message || "Gagal membatalkan transaksi.";
      toast.error(errorMessage);
    },
  });
};

// Hook untuk mendapatkan semua transaksi oleh pengguna
export const useGetTransactionsByUser = () => {
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

export const useGetTransactionById = (id: string) => {
  return useQuery<ApiResponse<Transaction>, Error>({
    queryKey: ["detail-transaction", id],
    queryFn: async () => {
      const res = await api.get(`/transactions/${id}`);
      return res.data;
    },
  });
};
