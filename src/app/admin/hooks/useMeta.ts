import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Packaging, ProductType, ProductTypesResponse } from "@/types/product";

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

const packagings = [
  { id: "Karung_50kg", name: "Karung 50kg" },
  { id: "Karung_25kg", name: "Karung 25kg" },
  { id: "Botol_1L", name: "Botol 1 Liter" },
  { id: "Sachet_1kg", name: "Sachet 1kg" },
];

export const usePackagings = () => {
  return useQuery<Packaging[]>({
    queryKey: ["packagings"],
    queryFn: () => {
      // const res = await api.get<ApiReturn<Packaging[]>>("/packagings");
      return packagings;
    },
  });
};
