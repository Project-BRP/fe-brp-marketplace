// src/types/transaction.ts

import { ApiResponse } from "./api";

export type deliveryStatusList = string[];
export type manualStatusList = string[];
export interface StatusListResponse {
  deliveryStatusList: deliveryStatusList;
  manualStatusList: manualStatusList;
}

export interface TransactionItem {
  id: string;
  quantity: number;
  priceRupiah: number;
  isStockIssue: boolean;
  variant: {
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
  method: string;
  deliveryStatus: string | null;
  manualStatus: string | null;
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
  shippingCost: number | null;
  paymentMethod: string | null;
  cancelReason: string | null;
  isRefundFailed: boolean;
  createdAt: string;
  updatedAt: string;
  transactionItems?: TransactionItem[];
}

export interface CreateTransactionData {
  shippingAddress: string;
  provinceId: number;
  cityId: number;
  districtId: number;
  subdistrictId: number;
  postalCode: string;
  method: string;
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

export type CancelTransactionResponse = ApiResponse<Transaction>;
export type CancelTransactionPayload = {
  cancelReason: string;
};
export type CancelTransactionData = {
  transactionId: string;
  payload: CancelTransactionPayload;
};

export type UpdateTransactionStatusPayload = {
  deliveryStatus?: string;
  manualStatus?: string;
};
