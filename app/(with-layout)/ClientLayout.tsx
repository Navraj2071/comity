"use client";

import type React from "react";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import { Header } from "@/components/header/header";
import { Sidebar } from "@/components/sidebar/sidebar";
import useStore from "@/lib/store/useStore";
import { PacmanLoader } from "react-spinners";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, poppulateAllData } = useStore();

  useEffect(() => {
    poppulateAllData();

    return () => {
      localStorage.clear();
    };
  }, []);

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        {loading ? (
          <div className="h-screen w-screen flex flex-col content-center items-center justify-center">
            <Image
              src={"/logo-comity.png"}
              height={300}
              width={300}
              alt="Comity"
            />
            <PacmanLoader color="rgb(244, 201, 0)" size={50} />
          </div>
        ) : (
          <div className="flex h-screen bg-gray-900 text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              {children}
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
