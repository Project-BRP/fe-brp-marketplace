// src/app/(main)/hooks/useTransaction.ts

import { socket } from "@/lib/socket";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import api from "@/lib/api";
import useUserStore from "@/store/userStore";
import { ApiError, ApiResponse } from "@/types/api";
import {
  CancelTransactionData,
  CancelTransactionResponse,
  CreateTransactionData,
  CreateTransactionResponse,
  GetTransactionsResponse,
  StatusListResponse,
  Transaction,
  TransactionsResponseData,
  UpdateTransactionStatusPayload,
} from "@/types/transaction";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
      console.log(error);
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
  const queryClient = useQueryClient();

  useEffect(() => {
    if (userData?.userId) {
      socket.connect();

      const handleNewTransaction = (transactions: GetTransactionsResponse) => {
        queryClient.setQueryData(
          ["transactions", userData.userId],
          transactions,
        );
      };

      const handleTransactionUpdate = (
        transactions: GetTransactionsResponse,
      ) => {
        queryClient.setQueryData(
          ["transactions", userData.userId],
          transactions,
        );
      };

      socket.on("newTransaction", handleNewTransaction);
      socket.on("transactions", handleTransactionUpdate);

      return () => {
        socket.off("newTransaction", handleNewTransaction);
        socket.off("transactions", handleTransactionUpdate);
        socket.disconnect();
      };
    }
  }, [userData?.userId, queryClient]);

  return useQuery<GetTransactionsResponse, Error>({
    queryKey: ["transactions", userData?.userId],
    queryFn: async () => {
      if (!userData?.userId) throw new Error("User tidak ditemukan");
      const res = await api.get(`/transactions/user/${userData.userId}`);
      return res.data;
    },
    enabled: !!userData?.userId,
  });
};

// Tipe untuk parameter filter di halaman admin
type GetAllTransactionsParams = {
  page?: number;
  limit?: number;
  search?: string;
  method?: "MANUAL" | "DELIVERY";
  status?: string;
};

// Hook untuk admin mendapatkan semua transaksi dengan filter dan paginasi
export const useGetAllTransactions = (params: GetAllTransactionsParams) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.connect();

    const handleNewTransaction = () => {
      toast.success("Transaksi baru diterima!");
      queryClient.invalidateQueries({ queryKey: ["admin-transactions"] });
    };

    const handleUpdateTransaction = () => {
      queryClient.invalidateQueries({ queryKey: ["admin-transactions"] });
    };

    socket.on("newTransaction", handleNewTransaction);
    socket.on("transactions", handleUpdateTransaction);

    return () => {
      socket.off("newTransaction", handleNewTransaction);
      socket.off("transactions", handleUpdateTransaction);
      socket.disconnect();
    };
  }, [queryClient]);

  return useQuery<ApiResponse<TransactionsResponseData>, Error>({
    queryKey: ["admin-transactions", params],
    queryFn: async () => {
      console.log(params);
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.set("page", String(params.page));
      if (params.limit) queryParams.set("limit", String(params.limit));
      if (params.search) queryParams.set("search", params.search);
      if (params.method && params.method !== undefined)
        queryParams.set("method", params.method);
      if (params.status) {
        if (params.method === "MANUAL") {
          queryParams.set("manualStatus", params.status);
        } else if (params.method === "DELIVERY") {
          queryParams.set("deliveryStatus", params.status);
        }
      }
      const res = await api.get(`/transactions?${queryParams.toString()}`);
      return res.data;
    },
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

// Hook untuk memperbarui produk yang ada
export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<Transaction>,
    AxiosError<ApiError>,
    { id: string; payload: UpdateTransactionStatusPayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await api.patch<ApiResponse<Transaction>>(
        `/transactions/${id}`,
        payload,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Transaksi berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Gagal memperbarui Transaksi.",
      );
    },
  });
};
