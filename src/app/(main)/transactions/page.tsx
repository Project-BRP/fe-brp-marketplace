import Typography from "@/components/Typography";
import { Suspense } from "react";
import TransactionPageContent from "./container/TransactionPageContent";

export default function TransactionHistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Typography variant="h1">Loading Transactions...</Typography>
        </div>
      }
    >
      <TransactionPageContent />
    </Suspense>
  );
}
