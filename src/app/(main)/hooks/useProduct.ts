import { api } from "@/lib/api";
import { ApiResponse, paginatedProductResponse } from "@/types/api";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";

type GetAllProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  productTypeId?: string;
};

export const useGetAllProducts = (params: GetAllProductsParams) => {
  return useQuery<paginatedProductResponse>({
    queryKey: ["products", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.set("page", String(params.page));
      if (params.limit) queryParams.set("limit", String(params.limit));
      if (params.search) queryParams.set("search", params.search);

      if (params.productTypeId && params.productTypeId !== "Semua") {
        queryParams.set("productTypeId", params.productTypeId);
      }

      const res = await api.get<ApiResponse<paginatedProductResponse>>(
        `/products?${queryParams.toString()}`,
      );
      return res.data.data;
    },
  });
};

export const useGetProductById = (id: string) => {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};
