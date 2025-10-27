"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, Map } from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Header } from "@/components/header";
import { Logo } from "@/components/logo";

interface AppShellProps {
  children: ReactNode;
  title: string;
}

export default function AppShell({ children, title }: AppShellProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/",
      label: "Home",
      icon: Map,
    },
    {
      href: "/roadtrip",
      label: "Roadtrip",
      icon: LayoutDashboard,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Logo className="w-8 h-8 text-sidebar-foreground" />
            <span className="font-bold text-lg">RoadHog</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header title={title} />
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
