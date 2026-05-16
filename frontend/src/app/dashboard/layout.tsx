"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken || !user) {
      router.push("/staff-login");
      return;
    }
    if (user.role === "Borrower") {
      router.push("/apply");
    }
  }, [user, accessToken, router]);

  if (!user || user.role === "Borrower") return null;

  return (
    <div className="flex min-h-screen bg-dark">
      <Sidebar />
      <div className="flex-1 ml-[260px]">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
