"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, "borrower");
    } catch {
      // error handled in hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: "rgb(var(--color-bg))" }}>
      {/* Theme toggle — top right */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left panel — branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-md px-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-8 shadow-xl">
            <span className="text-white font-bold text-2xl">CS</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Financial Freedom,<br />
            <span className="bg-gradient-to-r from-indigo-200 to-violet-200 bg-clip-text text-transparent">Reimagined.</span>
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 opacity-80">
            Secure personal loans tailored to your needs. Apply in minutes, get approved instantly, and track every step of your journey.
          </p>

          <div className="space-y-4">
            {[
              { icon: "⚡", text: "Instant eligibility check" },
              { icon: "📄", text: "Paperless documentation" },
              { icon: "🔒", text: "Bank-grade security" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-xl backdrop-blur-sm border border-white/10">
                <span className="text-xl">{f.icon}</span>
                <span className="text-white text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20">
              <span className="text-white font-bold text-xl">CS</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold" style={{ color: "rgb(var(--color-text))" }}>Welcome back</h2>
            <p className="mt-2" style={{ color: "rgb(var(--color-text-secondary))" }}>Please enter your details to sign in</p>
          </div>

          <div className="glass-card p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                id="user-login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
              <Input
                label="Password"
                id="user-login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <Button
                type="submit"
                loading={loading}
                className="w-full h-12 shadow-lg shadow-indigo-500/25"
                size="lg"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-8 pt-6 text-center border-t" style={{ borderColor: "var(--glass-border)" }}>
              <p className="text-sm" style={{ color: "rgb(var(--color-text-muted))" }}>
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary font-bold hover:underline underline-offset-4">
                  Sign up now
                </Link>
              </p>
            </div>
          </div>

          {/* Staff login hint */}
          <div className="mt-8 text-center">
            <Link 
              href="/staff-login" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all border group"
              style={{ 
                background: "rgb(var(--color-bg-secondary))",
                borderColor: "var(--glass-border)",
                color: "rgb(var(--color-text-secondary))"
              }}
            >
              <svg className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Are you an employee?</span>
              <span className="text-primary">Staff Login →</span>
            </Link>
          </div>

          {/* Demo account */}
          <div className="mt-6 text-center">
            <button 
              type="button" 
              onClick={() => { setEmail("borrower@lms.com"); setPassword("Borrower@123"); }} 
              className="text-xs font-medium opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: "rgb(var(--color-text-muted))" }}
            >
              Use demo account: <span className="underline">borrower@lms.com</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
