// src/app/admin/hooks/useAdminProduct.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import api from "@/lib/api";
import { ApiError, ApiResponse } from "@/types/api";
import {
  CreateProductPayload,
  Product,
  ProductType,
  UpdateProductPayload,
} from "@/types/product";

const PRODUCTS_QUERY_KEY = ["products"];
const PRODUCT_TYPES_QUERY_KEY = ["product-types"];

// Hook untuk membuat produk baru
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
      toast.success("Produk berhasil dibuat!");
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal membuat produk.");
    },
  });
};

// Hook untuk memperbarui produk yang ada
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<Product>,
    AxiosError<ApiError>,
    { id: string; payload: UpdateProductPayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await api.patch<ApiResponse<Product>>(
        `/products/${id}`,
        payload,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Produk berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...PRODUCTS_QUERY_KEY, variables.id],
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui produk.");
    },
  });
};

// Hook untuk menghapus produk
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, AxiosError<ApiError>, string>({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse<null>>(`/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Produk berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal menghapus produk.");
    },
  });
};

// --- Product Type Mutations ---

// Hook untuk membuat tipe produk baru
export const useCreateProductType = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<ProductType>,
    AxiosError<ApiError>,
    { name: string }
  >({
    mutationFn: async (payload) => {
      const response = await api.post<ApiResponse<ProductType>>(
        "/product-types",
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Tipe produk berhasil dibuat!");
      queryClient.invalidateQueries({ queryKey: PRODUCT_TYPES_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Gagal membuat tipe produk.",
      );
    },
  });
};

// Hook untuk memperbarui tipe produk
export const useUpdateProductType = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<ProductType>,
    AxiosError<ApiError>,
    { id: string; payload: { name: string } }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await api.patch<ApiResponse<ProductType>>(
        `/product-types/${id}`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Tipe produk berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: PRODUCT_TYPES_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Gagal memperbarui tipe produk.",
      );
    },
  });
};

// Hook untuk menghapus tipe produk
export const useDeleteProductType = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, AxiosError<ApiError>, string>({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse<null>>(
        `/product-types/${id}`,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Tipe produk berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: PRODUCT_TYPES_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Gagal menghapus tipe produk.",
      );
    },
  });
};
