// src/app/(main)/hooks/useCart.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { api } from "@/lib/api";
import { ApiError, ApiResponse } from "@/types/api";
import {
  AddToCartPayload,
  Cart,
  CartItem,
  UpdateCartItemPayload,
} from "@/types/cart";
import { AxiosError } from "axios";

const CART_QUERY_KEY = ["cart"];

// Hook untuk mendapatkan data cart
export const useGetCart = () => {
  return useQuery<Cart, AxiosError<ApiError>>({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const res = await api.get<ApiResponse<Cart>>("/carts");
      return res.data.data;
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, AxiosError<ApiError>>({
    mutationFn: async () => {
      const res = await api.patch<ApiResponse<null>>("/carts/clear");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Keranjang berhasil dikosongkan!");
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Gagal mengosongkan keranjang.",
      );
    },
  });
};

// Hook untuk menambahkan item ke cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<CartItem>,
    AxiosError<ApiError>,
    AddToCartPayload
  >({
    mutationFn: async (payload) => {
      const response = await api.post<ApiResponse<CartItem>>(
        "/cart-items",
        payload,
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal menambahkan produk.");
    },
  });
};

// Hook untuk memperbarui item di cart
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<CartItem>,
    AxiosError<ApiError>,
    { cartItemId: string; payload: UpdateCartItemPayload }
  >({
    mutationFn: async ({ cartItemId, payload }) => {
      const response = await api.patch<ApiResponse<CartItem>>(
        `/cart-items/${cartItemId}`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Jumlah produk berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui produk.");
    },
  });
};

// Hook untuk menghapus item dari cart
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, AxiosError<ApiError>, string>({
    mutationFn: async (cartItemId) => {
      const response = await api.delete<ApiResponse<null>>(
        `/cart-items/${cartItemId}`,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Produk berhasil dihapus dari keranjang!");
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal menghapus produk.");
    },
  });
};
