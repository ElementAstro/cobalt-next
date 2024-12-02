"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Telescope,
  Camera,
  Crosshair,
  Focus,
  Filter,
  Settings,
  RotateCcw,
  Power,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { name: "Telescope", href: "/", icon: Telescope },
  { name: "Camera", href: "/camera", icon: Camera },
  { name: "Guider", href: "/guider", icon: Crosshair },
  { name: "Focuser", href: "/focuser", icon: Focus },
  { name: "Filter Wheel", href: "/filter-wheel", icon: Filter },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarProvider>
      <Sidebar
        className={cn(
          "bg-secondary transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      pathname === item.href && "bg-accent",
                      collapsed && "justify-center"
                    )}
                  >
                    <item.icon
                      className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")}
                    />
                    {!collapsed && item.name}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  collapsed && "justify-center"
                )}
              >
                <Settings
                  className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")}
                />
                {!collapsed && "Settings"}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  collapsed && "justify-center"
                )}
              >
                <RotateCcw
                  className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")}
                />
                {!collapsed && "Reset"}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  collapsed && "justify-center"
                )}
              >
                <Power className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
                {!collapsed && "Power"}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <ThemeToggle />
          <Button
            variant="ghost"
            className="w-full justify-center"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
