import api from "@/lib/api";
import { ApiError, ApiResponse } from "@/types/api";
import { CompanyInfo } from "@/types/companyInfo";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const COMPANY_INFO_QUERY_KEY = ["companyInfo"];

export const useGetCompanyInfo = () => {
  return useQuery<CompanyInfo, AxiosError<ApiError>>({
    queryKey: COMPANY_INFO_QUERY_KEY,
    queryFn: async () => {
      const res = await api.get<ApiResponse<CompanyInfo>>("/company-info");
      return res.data.data;
    },
  });
};
