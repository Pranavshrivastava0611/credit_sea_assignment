"use client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";
import toast from "react-hot-toast";

export function useAuth() {
  const router = useRouter();
  const { user, accessToken, setAuth, clearAuth } = useAuthStore();

  const login = async (email: string, password: string, loginType: "borrower" | "staff" = "borrower") => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      const loggedInUser = data.data.user;
      const role = loggedInUser.role;

      // Enforce login type: borrowers can only use /login, staff can only use /staff-login
      if (loginType === "borrower" && role !== "Borrower") {
        toast.error("Staff accounts must use the Staff Login portal.");
        return;
      }
      if (loginType === "staff" && role === "Borrower") {
        toast.error("Borrower accounts must use the User Login portal.");
        return;
      }

      setAuth(loggedInUser, data.data.accessToken);
      toast.success(`Welcome back, ${loggedInUser.name}!`);

      // Redirect based on role
      if (role === "Borrower") {
        router.push("/borrower-dashboard");
      } else if (role === "Admin") {
        router.push("/dashboard/admin");
      } else {
        router.push(`/dashboard/${role.toLowerCase()}`);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const { data } = await api.post("/auth/signup", { name, email, password });
      setAuth(data.data.user, data.data.accessToken);
      toast.success("Account created successfully!");
      router.push("/borrower-dashboard");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Signup failed";
      toast.error(msg);
      throw error;
    }
  };

  const logout = async () => {
    const wasStaff = user && user.role !== "Borrower";
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    }
    clearAuth();
    toast.success("Logged out");
    router.push(wasStaff ? "/staff-login" : "/login");
  };

  return { user, accessToken, login, signup, logout, isAuthenticated: !!accessToken };
}
