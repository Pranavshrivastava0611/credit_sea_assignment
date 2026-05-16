"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(name, email, password);
    } catch {
      // error handled in hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: "rgb(var(--color-bg))" }}>
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
            <span className="text-white font-bold text-2xl">CS</span>
          </div>
          <h1 className="text-3xl font-extrabold" style={{ color: "rgb(var(--color-text))" }}>Join CreditSea</h1>
          <p className="mt-2" style={{ color: "rgb(var(--color-text-secondary))" }}>Start your journey towards financial freedom</p>
        </div>

        <div className="glass-card p-8 shadow-2xl border-t-2 border-t-primary/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
            <Input
              label="Email Address"
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              minLength={6}
              required
            />
            <Button 
              type="submit" 
              loading={loading} 
              className="w-full h-12 shadow-lg shadow-indigo-500/25 font-bold" 
              size="lg"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-8 pt-6 text-center border-t" style={{ borderColor: "var(--glass-border)" }}>
            <p className="text-sm" style={{ color: "rgb(var(--color-text-muted))" }}>
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs" style={{ color: "rgb(var(--color-text-muted))" }}>
            By creating an account, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
