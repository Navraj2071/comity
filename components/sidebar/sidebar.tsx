"use client";

import { useEffect, useState } from "react";
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
  ListChecks,
  MoveDownIcon,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useStore from "@/lib/store/useStore";
import Loader from "./loader";

export function Sidebar() {
  const store = useStore();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navigation = [{ name: "Dashboard", href: "/", icon: LayoutDashboard }];

  let isHOD = false;
  let isSPOC = false;
  let isFromCompliance = false;

  store?.db?.departments?.map((dept: any) => {
    if (dept.spoc === store?.db?.user?._id) {
      isSPOC = true;
    }
    if (dept.head === store?.db?.user?._id) {
      isHOD = true;
    }
    if (
      dept._id === store?.db?.user?.department &&
      dept.name === "Compliance"
    ) {
      isFromCompliance = true;
    }
  });

  if (isFromCompliance || store?.db?.user?.role === "Super-user") {
    navigation.push({
      name: "Checkpoints",
      href: "/checkpoints",
      icon: FileCheck,
    });
    navigation.push({
      name: "Compliances",
      href: "/compliances",
      icon: ListChecks,
    });
  }

  if (isSPOC || store?.db?.user?.role === "Super-user") {
    navigation.push({
      name: "Submissions",
      href: "/submissions",
      icon: ClipboardList,
    });
  }

  if (isHOD || store?.db?.user?.role === "Super-user") {
    navigation.push({ name: "Reviews", href: "/reviews", icon: Eye });
  }

  navigation.push({ name: "Reports", href: "/reports", icon: BarChart3 });
  navigation.push({
    name: "RBI Audit",
    href: "/rbi-audit",
    icon: AlertTriangle,
  });
  navigation.push({
    name: "Policies & SOPs",
    href: "/policies-sops",
    icon: BookOpen,
  });

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

      {!store?.db?.user || !store?.db?.departments ? (
        <Loader collapsed={collapsed} />
      ) : (
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
                  <item.icon
                    className={cn("h-4 w-4", collapsed ? "" : "mr-3")}
                  />
                  {!collapsed && <span>{item.name}</span>}
                </Button>
              </Link>
            );
          })}
          {(store?.db?.user?.role === "Admin" ||
            store?.db?.user?.role === "Super-user") && (
            <SettingsMenu
              collapsed={collapsed}
              pathname={pathname}
              setCollapsed={setCollapsed}
            />
          )}
        </nav>
      )}

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

const SettingsMenu = ({ collapsed, pathname, setCollapsed }: any) => {
  const [isOpen, setIsopen] = useState(
    pathname in ["/users", "/departments", "/regulatory-departments"]
  );

  const navigation = [
    { name: "User Management", href: "/users", icon: Users },
    { name: "Departments", href: "/departments", icon: Building2 },
    { name: "Regulatory Depts", href: "/regulatory-departments", icon: Shield },
  ];

  return (
    <>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 mb-0.5 text-sm transition-colors duration-200 flex flex-col",
          collapsed ? "px-2" : "px-3"
        )}
        onClick={() => {
          setCollapsed(false);
          setIsopen(!isOpen);
        }}
      >
        <div
          className="flex items-center justify-between w-full"
          onClick={() => setIsopen(!isOpen)}
        >
          <div className="flex items-center w-full mb-2">
            <Settings className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
            {!collapsed && <span>Settings</span>}
          </div>
          {!collapsed ? !isOpen ? <ArrowDown /> : <ArrowUp /> : ""}
        </div>
      </Button>
      {!collapsed && isOpen && (
        <div className="flex flex-col w-full">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 mb-0.5 text-sm transition-colors duration-200",
                    isActive &&
                      "bg-[#e9b306] text-black hover:bg-[#d58600] hover:text-black"
                  )}
                >
                  <item.icon
                    className={cn("h-4 w-4", collapsed ? "" : "mr-3 ml-3")}
                  />
                  {!collapsed && <span>{item.name}</span>}
                </Button>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
};
