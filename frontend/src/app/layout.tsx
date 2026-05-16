import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "CreditSea LMS - Loan Management System",
  description: "A modern loan management system for borrowers and operations teams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark min-h-screen">
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
