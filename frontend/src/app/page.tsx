"use client";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

const STATS = [
  { value: "₹50L+", label: "Loans Disbursed" },
  { value: "2,500+", label: "Active Borrowers" },
  { value: "99.2%", label: "Approval Rate" },
  { value: "<5min", label: "Avg. Processing" },
];

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Instant Eligibility",
    desc: "Know your loan eligibility in seconds with our smart Business Rules Engine.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Secure & Encrypted",
    desc: "Bank-grade security with JWT authentication and role-based access control.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Real-time Tracking",
    desc: "Track your loan from application to disbursement with live status updates.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Multi-role Ops",
    desc: "Dedicated dashboards for Sales, Sanction, Disbursement, and Collection teams.",
  },
];

const STEPS = [
  { num: "01", title: "Create Account", desc: "Sign up in seconds with just your email" },
  { num: "02", title: "Check Eligibility", desc: "Instant BRE check with PAN & salary verification" },
  { num: "03", title: "Upload Documents", desc: "Upload your salary slip for verification" },
  { num: "04", title: "Get Funded", desc: "Receive funds directly to your bank account" },
];

export default function LandingPage() {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();

  // If already logged in, redirect
  useEffect(() => {
    if (accessToken && user) {
      if (user.role === "Borrower") {
        router.push("/borrower-dashboard");
      } else if (user.role === "Admin") {
        router.push("/dashboard/admin");
      } else {
        router.push(`/dashboard/${user.role.toLowerCase()}`);
      }
    }
  }, [user, accessToken, router]);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl" style={{ background: "var(--navbar-bg)", borderBottom: "1px solid var(--glass-border)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <span className="font-semibold text-lg" style={{ color: "rgb(var(--color-text))" }}>CreditSea</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-medium transition-all" style={{ color: "rgb(var(--color-text-secondary))" }}>
              Sign in
            </Link>
            <Link href="/signup" className="btn-primary !px-5 !py-2 !text-sm !rounded-xl">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Decorative elements */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Trusted by 2,500+ borrowers across India
            </span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6"
            style={{ color: "rgb(var(--color-text))" }}
          >
            Smart Loans,{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
              Simplified.
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "rgb(var(--color-text-secondary))" }}
          >
            Apply for personal loans from ₹50,000 to ₹5,00,000 in under 5 minutes.
            Instant eligibility, transparent rates, and real-time tracking.
          </motion.p>

          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/signup" className="btn-primary !px-8 !py-4 !text-base !rounded-2xl flex items-center justify-center gap-2">
              Apply for a Loan
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/staff-login" className="btn-ghost !px-8 !py-4 !text-base !rounded-2xl flex items-center justify-center gap-2">
              Staff Portal
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  {s.value}
                </p>
                <p className="text-xs mt-1" style={{ color: "rgb(var(--color-text-muted))" }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "rgb(var(--color-text))" }}>
              Everything you need in a{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">loan platform</span>
            </h2>
            <p className="max-w-lg mx-auto" style={{ color: "rgb(var(--color-text-secondary))" }}>
              Built for borrowers who value speed, and operations teams who demand control.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 group hover:scale-[1.03] transition-transform duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-semibold mb-2" style={{ color: "rgb(var(--color-text))" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-text-secondary))" }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "rgb(var(--color-text))" }}>
              Four steps to your{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">funds</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
                  <span className="text-white font-bold text-lg">{step.num}</span>
                </div>
                <h3 className="font-semibold mb-1" style={{ color: "rgb(var(--color-text))" }}>{step.title}</h3>
                <p className="text-sm" style={{ color: "rgb(var(--color-text-muted))" }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass-card p-12 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10" style={{ color: "rgb(var(--color-text))" }}>
            Ready to get started?
          </h2>
          <p className="mb-8 relative z-10 max-w-lg mx-auto" style={{ color: "rgb(var(--color-text-secondary))" }}>
            Join thousands of borrowers who trust CreditSea for their financial needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href="/signup" className="btn-primary !px-8 !py-4 !text-base !rounded-2xl">
              Create Free Account
            </Link>
            <Link href="/login" className="btn-ghost !px-8 !py-4 !text-base !rounded-2xl">
              I have an account
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 px-6" style={{ borderTop: "1px solid var(--glass-border)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">CS</span>
            </div>
            <span className="font-semibold" style={{ color: "rgb(var(--color-text))" }}>CreditSea</span>
          </div>
          <p className="text-sm" style={{ color: "rgb(var(--color-text-muted))" }}>
            © {new Date().getFullYear()} CreditSea LMS. Built for demonstration purposes.
          </p>
          <div className="flex gap-6">
            <Link href="/login" className="text-sm hover:text-primary transition-colors" style={{ color: "rgb(var(--color-text-secondary))" }}>User Login</Link>
            <Link href="/staff-login" className="text-sm hover:text-primary transition-colors" style={{ color: "rgb(var(--color-text-secondary))" }}>Staff Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
