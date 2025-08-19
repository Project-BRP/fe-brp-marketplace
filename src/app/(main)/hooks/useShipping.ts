import api from "@/lib/api";
import { ApiError, ApiResponse } from "@/types/api";
import {
  CheckCostPayload,
  Cities,
  Provinces,
  ShippingOption,
  SubDistricts,
} from "@/types/shipping";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const PROVINCE_QUERY_KEY = ["provinces"];
const CITIES_QUERY_KEY = ["cities"];
const DISTRICTS_QUERY_KEY = ["districts"];
const SUBDISTRICTS_QUERY_KEY = ["subdistricts"];

export const useGetProvinces = () => {
  return useQuery<Provinces[], Error>({
    queryKey: PROVINCE_QUERY_KEY,
    queryFn: async () => {
      const res = await api.get<ApiResponse<Provinces[]>>(
        "/shipping/provinces",
      );
      return res.data.data;
    },
  });
};

export const useGetCities = (provinceId: string) => {
  return useQuery<Cities[], Error>({
    queryKey: [...CITIES_QUERY_KEY, provinceId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Cities[]>>(
        `/shipping/provinces/${provinceId}/cities`,
      );
      return res.data.data;
    },
    enabled: !!provinceId,
  });
};

export const useGetDistricts = (provinceId: string, cityId: string) => {
  return useQuery<Cities[], Error>({
    queryKey: [...DISTRICTS_QUERY_KEY, cityId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Cities[]>>(
        `/shipping/provinces/${provinceId}/cities/${cityId}/districts`,
      );
      return res.data.data;
    },
    enabled: !!provinceId && !!cityId,
  });
};

export const useGetSubDistricts = (
  provinceId: string,
  cityId: string,
  districtId: string,
) => {
  return useQuery<SubDistricts[], Error>({
    queryKey: [...SUBDISTRICTS_QUERY_KEY, districtId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<SubDistricts[]>>(
        `/shipping/provinces/${provinceId}/cities/${cityId}/districts/${districtId}/sub-districts`,
      );
      return res.data.data;
    },
    enabled: !!provinceId && !!cityId && !!districtId,
  });
};

export const useCheckCost = () => {
  return useMutation<
    ApiResponse<ShippingOption[]>,
    AxiosError<ApiError>,
    CheckCostPayload
  >({
    mutationFn: async (payload) => {
      const response = await api.post<ApiResponse<ShippingOption[]>>(
        "/shipping/check-cost",
        payload,
      );
      return response.data;
    },
    onSuccess: (success) => {
      toast.success(success.message || "Berhasil memeriksa biaya pengiriman.");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Gagal memeriksa biaya pengiriman.",
      );
    },
  });
};
