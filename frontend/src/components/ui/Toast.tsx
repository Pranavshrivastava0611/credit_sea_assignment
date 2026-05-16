"use client";
import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "rgba(15, 20, 40, 0.95)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          borderRadius: "12px",
          fontSize: "14px",
        },
        success: {
          iconTheme: {
            primary: "#10B981",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#F43F5E",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}
