// src/types/transaction.ts

import { ApiResponse } from "./api";

export type TransactionStatus =
  | "UNPAID"
  | "PAID"
  | "CANCELLED"
  | "SHIPPING"
  | "DELIVERED"
  | "COMPLETED";

export interface TransactionItem {
  id: string;
  quantity: number;
  priceRupiah: number;
  isStockIssue: boolean;
  ProductVariant: {
    id: string;
    weight_in_kg: number;
    imageUrl: string;
    priceRupiah: number;
    product: {
      id: string;
      name: string;
      imageUrl: string;
    };
    packaging: {
      id: string;
      name: string;
    };
    stock: number;
  };
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhoneNumber: string | null;
  status: TransactionStatus;
  cleanPrice: number;
  priceWithPPN: number;
  totalPrice: number;
  PPNPercentage: number;
  snapToken: string;
  snapUrl: string;
  shippingAddress: string;
  city: string;
  province: string;
  postalCode: string;
  shippingCost: number;
  paymentMethod: string | null;
  createdAt: string;
  updatedAt: string;
  transactionItems?: TransactionItem[];
}

export interface CreateTransactionData {
  shippingAddress: string;
  city: string;
  province: string;
  postalCode: string;
}

export type CreateTransactionResponse = ApiResponse<Transaction>;

export interface TransactionsResponseData {
  totalPage: number;
  currentPage: number;
  transactions: Transaction[];
}

export type GetTransactionsResponse = ApiResponse<TransactionsResponseData>;

export type PPN = {
  percentage: number;
};
