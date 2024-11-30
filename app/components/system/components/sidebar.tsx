"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  List,
  Activity,
  Settings,
  BarChart2,
  Server,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/processes", label: "Processes", icon: List },
    { href: "/monitoring", label: "Monitoring", icon: Activity },
    { href: "/resources", label: "Resources", icon: BarChart2 },
    { href: "/services", label: "Services", icon: Server },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="h-full w-16 lg:w-64 bg-background border-r flex flex-col">
      <div className="p-2 lg:p-4">
        <h2 className="text-lg font-semibold mb-4 hidden lg:block">
          Task Manager
        </h2>
        <nav className="space-y-2">
          {links.map((link) => (
            <Button
              key={link.href}
              variant={pathname === link.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname === link.href && "bg-muted"
              )}
              asChild
            >
              <Link href={link.href}>
                <link.icon className="h-5 w-5 lg:mr-2" />
                <span className="hidden lg:inline-block">{link.label}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}
