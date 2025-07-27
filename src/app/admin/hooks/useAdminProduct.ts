// src/app/admin/hooks/useAdminProduct.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import api from "@/lib/api";
import { ApiError, ApiResponse } from "@/types/api";
import {
  Packaging,
  PackagingPayload,
  Product,
  ProductType,
  ProductVariant,
} from "@/types/product";

const PRODUCTS_QUERY_KEY = ["products"];
const PRODUCT_TYPES_QUERY_KEY = ["product-types"];
const PACKAGINGS_QUERY_KEY = ["packagings"];

// Hook untuk membuat produk baru
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Product>, AxiosError<ApiError>, FormData>({
    mutationFn: async (payload) => {
      const response = await api.post<ApiResponse<Product>>(
        "/products",
        payload,
        { headers: { "Content-Type": "multipart/form-data" } },
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
    { id: string; payload: FormData }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await api.patch<ApiResponse<Product>>(
        `/products/${id}`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } },
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

// --- Product Variant Mutations ---

// Hook to create a new product variant
export const useCreateProductVariant = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<ProductVariant>,
    AxiosError<ApiError>,
    FormData
  >({
    mutationFn: async (payload) => {
      const response = await api.post<ApiResponse<ProductVariant>>(
        `/product-variants/products/${productId}`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Varian produk berhasil ditambahkan!");
      // Invalidate the general product list and the specific product being viewed
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal menambahkan varian.");
    },
  });
};

// Hook to update a product variant
export const useUpdateProductVariant = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<ProductVariant>,
    AxiosError<ApiError>,
    { variantId: string; payload: FormData }
  >({
    mutationFn: async ({ variantId, payload }) => {
      const response = await api.patch<ApiResponse<ProductVariant>>(
        `/product-variants/${variantId}`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Varian produk berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui varian.");
    },
  });
};

// Hook to delete a product variant
export const useDeleteProductVariant = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, AxiosError<ApiError>, string>({
    mutationFn: async (variantId: string) => {
      const response = await api.delete<ApiResponse<null>>(
        `/product-variants/${variantId}`,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Varian produk berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal menghapus varian.");
    },
  });
};

// --- Packaging Mutations ---

// Hook to create a new packaging type
export const useCreatePackaging = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<Packaging>,
    AxiosError<ApiError>,
    PackagingPayload
  >({
    mutationFn: async (payload) => {
      const response = await api.post<ApiResponse<Packaging>>(
        "/packagings",
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Kemasan berhasil dibuat!");
      queryClient.invalidateQueries({ queryKey: PACKAGINGS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal membuat kemasan.");
    },
  });
};

// Hook to update a packaging type
export const useUpdatePackaging = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<Packaging>,
    AxiosError<ApiError>,
    { id: string; payload: PackagingPayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await api.patch<ApiResponse<Packaging>>(
        `/packagings/${id}`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Kemasan berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: PACKAGINGS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Gagal memperbarui kemasan.",
      );
    },
  });
};

// Hook to delete a packaging type
export const useDeletePackaging = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, AxiosError<ApiError>, string>({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse<null>>(`/packagings/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Kemasan berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: PACKAGINGS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal menghapus kemasan.");
    },
  });
};
