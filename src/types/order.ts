export interface OrderData {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    city: string;
    postalCode: string;
    province: string;
    notes?: string;
    method: string;
  };
  payment: {
    method: string;
  };
  items: CartItem[];
  summary: {
    subtotal: number;
    shippingCost: number;
    total: number;
  };
}

export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  composition: string;
  price: number;
  weight_in_kg: string;
  packagingName: string;
  quantity: number;
  imageUrl?: string | null;
}
