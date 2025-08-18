import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Cities, Provinces } from "@/types/shipping";
import { useQuery } from "@tanstack/react-query";

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
  return useQuery<Cities[], Error>({
    queryKey: [...SUBDISTRICTS_QUERY_KEY, districtId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Cities[]>>(
        `/shipping/provinces/${provinceId}/cities/${cityId}/districts/${districtId}/subdistricts`,
      );
      return res.data.data;
    },
    enabled: !!provinceId && !!cityId && !!districtId,
  });
};
