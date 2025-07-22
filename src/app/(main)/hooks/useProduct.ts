// src/app/(main)/hooks/useProducts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import api from "@/lib/api";
import { ApiError, ApiResponse } from "@/types/api";
import {
  CreateProductPayload,
  Product,
  ProductResponse, // Import the new response type
  UpdateProductPayload,
} from "@/types/product";

const PRODUCTS_QUERY_KEY = "products";

// Hook to fetch all products
export const useGetAllProducts = () => {
  return useQuery<Product[], AxiosError<ApiError>>({
    queryKey: [PRODUCTS_QUERY_KEY],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ProductResponse>>("/products");
      console.log("Products data:", response.data.data.products);
      return response.data.data.products;
    },
  });
};

// Hook to fetch a single product by its ID
export const useGetProductById = (id: string) => {
  return useQuery<Product, AxiosError<ApiError>>({
    queryKey: [PRODUCTS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
      return response.data.data;
    },
    enabled: !!id, // Only run the query if the id is not null/undefined
  });
};

// Hook to create a new product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<Product>,
    AxiosError<ApiError>,
    CreateProductPayload
  >({
    mutationFn: async (payload) => {
      const response = await api.post<ApiResponse<Product>>(
        "/products",
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Product created successfully!");
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create product.");
    },
  });
};

// Hook to update an existing product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<Product>,
    AxiosError<ApiError>,
    { id: string; payload: UpdateProductPayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await api.put<ApiResponse<Product>>(
        `/products/${id}`,
        payload,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Product updated successfully!");
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [PRODUCTS_QUERY_KEY, variables.id],
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update product.");
    },
  });
};

// Hook to delete a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, AxiosError<ApiError>, string>({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse<null>>(`/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Product deleted successfully!");
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete product.");
    },
  });
};
