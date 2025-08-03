"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import api from "@/lib/api";
import { ApiError, ApiResponse } from "@/types/api";
import { PPN } from "@/types/transaction";

export const useGetPPN = () => {
  return useQuery<PPN>({
    queryKey: ["PPN"],
    queryFn: async () => {
      const res = await api.get(`/ppn`);
      return res.data.data;
    },
  });
};

export const useUpdatePPN = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<PPN>, AxiosError<ApiError>, PPN>({
    mutationFn: async (payload) => {
      const response = await api.patch("/ppn", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("PPN berhasil diperbarui.");
      queryClient.invalidateQueries({ queryKey: ["PPN"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal mengupdate PPN.");
    },
  });
};
