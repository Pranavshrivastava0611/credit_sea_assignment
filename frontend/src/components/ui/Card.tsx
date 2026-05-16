"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode, CSSProperties } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  highlight?: boolean;
  hover?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export default function Card({ 
  children, 
  className, 
  highlight = false, 
  hover = false,
  onClick,
  style
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      style={style}
      className={cn(
        highlight ? "glass-card-highlight" : "glass-card",
        hover && "hover:bg-white/[0.06] transition-colors duration-200 cursor-pointer",
        "p-6",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
