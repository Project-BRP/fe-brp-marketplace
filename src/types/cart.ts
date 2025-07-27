// src/types/cart.ts
import { ProductVariant } from "./product";

export interface CartItem {
  id: string;
  productVariantId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  productVariant: Omit<ProductVariant, "productId"> & {
    product: ProductInCart;
    is_deleted: boolean;
  };
}

export interface Cart {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
}

export interface AddToCartPayload {
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

interface ProductInCart {
  id: string;
  name: string;
  is_deleted: boolean;
}
