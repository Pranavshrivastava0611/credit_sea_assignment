"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function Home() {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken || !user) {
      router.push("/login");
      return;
    }

    // Redirect based on role
    switch (user.role) {
      case "Borrower":
        router.push("/borrower-dashboard");
        break;
      case "Admin":
        router.push("/dashboard/admin");
        break;
      case "Sales":
        router.push("/dashboard/sales");
        break;
      case "Sanction":
        router.push("/dashboard/sanction");
        break;
      case "Disbursement":
        router.push("/dashboard/disbursement");
        break;
      case "Collection":
        router.push("/dashboard/collection");
        break;
      default:
        router.push("/login");
    }
  }, [user, accessToken, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-400">Redirecting...</div>
    </div>
  );
}
