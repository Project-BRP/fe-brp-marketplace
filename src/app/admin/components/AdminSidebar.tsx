"use client"; // Add this directive for client-side hooks

import {
  BarChart3,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/Sidebar";
import clsxm from "@/lib/clsxm";

// Menu items configuration remains the same
const menuItems = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "Produk", url: "/admin/products", icon: Package },
  { title: "Pesanan", url: "/admin/orders", icon: ShoppingCart },
  { title: "Pelanggan", url: "/admin/customers", icon: Users },
  { title: "Laporan", url: "/admin/reports", icon: BarChart3 },
  { title: "Pengaturan", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  // Replaced useLocation with usePathname for Next.js App Router
  const currentPath = usePathname();

  return (
    <Sidebar
      className={state === "collapsed" ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="bg-background border-r border-border">
        {/* Header */}
        <div
          className={`p-4 border-b border-border ${
            state === "collapsed" ? "px-2" : ""
          }`}
        >
          {state !== "collapsed" ? (
            <div>
              <h2 className="text-lg font-bold text-primary">
                PT. Bumi Rekayasa
              </h2>
              <p className="text-sm text-muted-foreground">Admin Panel</p>
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                BR
              </span>
            </div>
          )}
        </div>

        <SidebarGroup className="px-2">
          <SidebarGroupLabel className={state === "collapsed" ? "sr-only" : ""}>
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                // Check if the current path matches the item's URL
                const isActive = currentPath === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    {/* Replaced NavLink with Next.js Link component */}
                    <Link href={item.url} passHref legacyBehavior>
                      <SidebarMenuButton
                        className={clsxm(
                          "h-12",
                          isActive
                            ? "bg-primary/10 text-primary font-medium border-r-2 border-primary"
                            : "hover:bg-muted/50",
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {state !== "collapsed" && (
                          <span className="ml-3">{item.title}</span>
                        )}
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
