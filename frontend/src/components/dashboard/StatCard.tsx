"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: "indigo" | "emerald" | "amber" | "rose" | "violet";
}

const colorMap = {
  indigo: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/20",
  emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/20",
  amber: "from-amber-500/20 to-amber-600/10 border-amber-500/20",
  rose: "from-rose-500/20 to-rose-600/10 border-rose-500/20",
  violet: "from-violet-500/20 to-violet-600/10 border-violet-500/20",
};

const iconColorMap = {
  indigo: "bg-indigo-500/20 text-indigo-400",
  emerald: "bg-emerald-500/20 text-emerald-400",
  amber: "bg-amber-500/20 text-amber-400",
  rose: "bg-rose-500/20 text-rose-400",
  violet: "bg-violet-500/20 text-violet-400",
};

export default function StatCard({ title, value, icon, trend, color = "indigo" }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-gradient-to-br border rounded-xl p-5",
        colorMap[color]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold font-mono text-white mt-1">{value}</p>
          {trend && (
            <p className="text-xs text-gray-500 mt-1">{trend}</p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconColorMap[color])}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
