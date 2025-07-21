"use client";

import { SidebarProvider } from "@/components/Sidebar";
import AdminNavbar from "@/layouts/AdminNavbar";
import { AdminSidebar } from "../components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminNavbar />
          <main className="flex-1 p-6 bg-muted/40 w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
