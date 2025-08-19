import api from "@/lib/api";
import { ApiError, ApiResponse } from "@/types/api";
import {
  CompanyInfo,
  CompanyInfoPayload,
  UpdateCompanyInfoPayload,
} from "@/types/companyInfo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const COMPANY_INFO_QUERY_KEY = ["companyInfo"];

export const useCreateCompanyInfo = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<CompanyInfo>,
    AxiosError<ApiError>,
    CompanyInfoPayload
  >({
    mutationFn: async (payload) => {
      const response = await api.post<ApiResponse<CompanyInfo>>(
        "/company-info",
        payload,
      );
      return response.data;
    },
    onSuccess: (success) => {
      toast.success(
        success.message || "Berhasil membuat informasi perusahaan.",
      );
      queryClient.invalidateQueries({ queryKey: COMPANY_INFO_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Gagal membuat informasi perusahaan.",
      );
    },
  });
};

export const useUpdateCompanyInfo = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<CompanyInfo>,
    AxiosError<ApiError>,
    UpdateCompanyInfoPayload
  >({
    mutationFn: async (payload) => {
      const response = await api.patch<ApiResponse<CompanyInfo>>(
        "/company-info",
        payload,
      );
      return response.data;
    },
    onSuccess: (success) => {
      toast.success(
        success.message || "Berhasil memperbarui informasi perusahaan.",
      );
      queryClient.invalidateQueries({ queryKey: COMPANY_INFO_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Gagal memperbarui informasi perusahaan.",
      );
    },
  });
};
