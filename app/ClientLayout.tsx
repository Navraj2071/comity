"use client";

import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    localStorage.clear();
  }, []);
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <div className="flex h-screen bg-gray-900 text-white">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
