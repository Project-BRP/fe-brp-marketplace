"use client";
import { SidebarProvider } from "@/components/Sidebar";
import AdminNavbar from "@/layouts/AdminNavbar";
import { AdminSidebar } from "../components/AdminSidebar";
import withAdminAuth from "../components/WithAdminAuth";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col w-full">
          <AdminNavbar />
          <main className="flex-1 p-6 bg-muted/40 w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

// 2. Wrap the AdminLayout with the withAdminAuth HOC before exporting
export default withAdminAuth(AdminLayout);
