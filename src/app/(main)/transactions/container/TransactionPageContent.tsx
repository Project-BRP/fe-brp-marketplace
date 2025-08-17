"use client";

import { useSearchParams } from "next/navigation";
import TransactionDetailPage from "./DetailTransaction";
import TransactionHistoryList from "./TransactionHistoryList";

export default function TransactionPageContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transaction_id");

  if (transactionId) {
    return <TransactionDetailPage />;
  }

  return <TransactionHistoryList />;
}
