import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "CreditSea — Modern Loan Management System",
  description: "Apply for personal loans in minutes. Track applications, manage disbursements, and handle collections — all in one beautiful platform.",
  keywords: ["loan management", "personal loans", "credit", "finance", "LMS"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen transition-colors duration-300">
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
