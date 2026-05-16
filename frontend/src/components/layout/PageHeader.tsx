"use client";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-8"
    >
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "rgb(var(--color-text))" }}>{title}</h1>
        {description && (
          <p className="text-sm mt-1" style={{ color: "rgb(var(--color-text-secondary))" }}>{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </motion.div>
  );
}
