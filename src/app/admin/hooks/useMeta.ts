import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {
  Packaging,
  PackagingResponse,
  ProductType,
  ProductTypesResponse,
} from "@/types/product";

export const useProductTypes = () => {
  return useQuery<ProductType[]>({
    queryKey: ["product-types"],
    queryFn: async () => {
      const res =
        await api.get<ApiResponse<ProductTypesResponse>>("/product-types");
      return res.data.data.productTypes;
    },
  });
};

export const usePackagings = () => {
  return useQuery<Packaging[]>({
    queryKey: ["packagings"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PackagingResponse>>("/packagings");
      return res.data.data.packagings;
    },
  });
};
