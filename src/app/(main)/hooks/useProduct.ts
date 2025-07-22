// src/app/(main)/hooks/useProduct.ts
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import api from "@/lib/api";
import { ApiError, ApiResponse } from "@/types/api";
import { Product, ProductResponse } from "@/types/product";

const PRODUCTS_QUERY_KEY = "products";

// Hook to fetch all products for the customer dashboard
export const useGetAllProducts = () => {
  return useQuery<Product[], AxiosError<ApiError>>({
    queryKey: [PRODUCTS_QUERY_KEY],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ProductResponse>>("/products");
      // Correctly access the nested 'products' array from the response
      return response.data.data.products;
    },
  });
};

// Hook to fetch a single product by its ID for the product detail page
export const useGetProductById = (id: string) => {
  return useQuery<Product, AxiosError<ApiError>>({
    queryKey: [PRODUCTS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
      return response.data.data;
    },
    enabled: !!id, // Only run the query if an ID is provided
  });
};
