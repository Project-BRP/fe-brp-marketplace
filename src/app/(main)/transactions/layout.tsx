import { Metadata } from "next";
import * as React from "react";

export const metadata: Metadata = {
  title: "Transaction",
};

export default function TransactionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
