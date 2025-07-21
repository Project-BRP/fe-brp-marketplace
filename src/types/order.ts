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
  id: string;
  name: string;
  npkFormula: string;
  price: number;
  unit: string;
  quantity: number;
  image?: string;
}
