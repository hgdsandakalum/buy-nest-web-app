"use client";

// import type { Metadata } from "next";
import "./globals.css";
import { ConfigProvider } from "antd";
import Loader from "../components/Loader";
import { useAppStore } from "@component/store";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// export const metadata: Metadata = {
//   title: "BuyNest",
//   description: "Where Smart Shopping Begins",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoading, setpageNameAction } = useAppStore();
  const pathname = usePathname();

  useEffect(() => {
    setpageNameAction(pathname);
  }, [pathname]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#003F62",
        },
      }}
    >
      <html lang="en">
        <body>
          {isLoading ?? <Loader />}
          {children}
        </body>
      </html>
    </ConfigProvider>
  );
}
