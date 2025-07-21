"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileCheck,
  ClipboardList,
  Eye,
  BarChart3,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "User Management", href: "/users", icon: Users },
  { name: "Departments", href: "/departments", icon: Building2 },
  { name: "Regulatory Depts", href: "/regulatory-departments", icon: Shield },
  { name: "Checkpoints", href: "/checkpoints", icon: FileCheck },
  { name: "Submissions", href: "/submissions", icon: ClipboardList },
  { name: "Reviews", href: "/reviews", icon: Eye },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "RBI Audit", href: "/rbi-audit", icon: AlertTriangle },
  { name: "Policies & SOPs", href: "/policies-sops", icon: BookOpen },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
      id="main-sidebar"
    >
      {/* Logo */}
      <div className="py-4 px-3 border-b border-gray-700 flex justify-center items-center">
        <div className="flex items-center justify-center">
          <Image
            src="/logo-comity.png"
            alt="Comity Logo"
            width={collapsed ? 160 : 240}
            height={collapsed ? 160 : 240}
            className="rounded transition-all duration-300"
            priority
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 mb-0.5 text-sm transition-colors duration-200",
                  collapsed ? "px-2" : "px-3",
                  isActive &&
                    "bg-[#e9b306] text-black hover:bg-[#d58600] hover:text-black"
                )}
              >
                <item.icon className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
                {!collapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full text-gray-400 hover:text-white hover:bg-gray-700/50"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}
