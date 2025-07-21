import { Metadata } from "next";
import * as React from "react";
import { AdminLayout } from "./_container/AdminLayout";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminLayout>{children}</AdminLayout>
    </>
  );
}
