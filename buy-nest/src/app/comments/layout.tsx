"use client";
import React from "react";
import DefaultLayout from "../../components/Layout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DefaultLayout>{children}</DefaultLayout>;
}
