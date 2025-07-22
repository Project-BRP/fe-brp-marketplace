import api from "@/lib/api";
import { ApiError, ApiResponse } from "@/types/api";
import {
  Packaging,
  PackagingResponse,
  ProductType,
  ProductTypesResponse,
} from "@/types/product";
// src/app/admin/hooks/useMeta.ts
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

// Hook to fetch all available product types
export const useProductTypes = () => {
  return useQuery<ProductType[], AxiosError<ApiError>>({
    queryKey: ["productTypes"],
    queryFn: async () => {
      const response =
        await api.get<ApiResponse<ProductTypesResponse>>("/product-types");
      return response.data.data.productTypes;
    },
  });
};

const packagings = [
  { id: "Karung_50kg", name: "Karung 50kg" },
  { id: "Karung_25kg", name: "Karung 25kg" },
  { id: "Botol_1L", name: "Botol 1 Liter" },
  { id: "Sachet_1kg", name: "Sachet 1kg" },
];

// Hook to fetch all available packaging options
export const usePackagings = () => {
  return useQuery<Packaging[], AxiosError<ApiError>>({
    queryKey: ["packagings"],
    // Assuming the endpoint is /packagings based on your schema
    queryFn: async () => {
      const response =
        await api.get<ApiResponse<PackagingResponse>>("/packagings");
      console.log("Packaging Response:", response.data);
      return packagings;
    },
  });
};
