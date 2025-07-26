"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import api from "@/lib/api";
import { ApiError, ApiResponse } from "@/types/api";
import { CompanyLogoResponse } from "@/types/config";

export const useUpdateCompanyLogo = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<CompanyLogoResponse>,
    AxiosError<ApiError>,
    FormData
  >({
    mutationFn: async (payload) => {
      const response = await api.post("/config/logo", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-profile"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal mengunggah logo.");
    },
  });
};
