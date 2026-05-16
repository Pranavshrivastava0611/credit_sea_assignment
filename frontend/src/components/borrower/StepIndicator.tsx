"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-10 overflow-x-auto py-2">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isActive ? 1.1 : 1 }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                  isCompleted && "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20",
                  isActive && "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30",
                  !isActive && !isCompleted && "border"
                )}
                style={!isActive && !isCompleted ? {
                  background: "rgb(var(--color-bg-secondary))",
                  borderColor: "var(--glass-border)",
                  color: "rgb(var(--color-text-muted))"
                } : undefined}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNum
                )}
              </motion.div>
              <span
                className="text-[10px] mt-2 font-bold uppercase tracking-wider whitespace-nowrap"
                style={{ color: isActive ? "rgb(var(--color-text))" : "rgb(var(--color-text-muted))" }}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-12 sm:w-20 h-0.5 mx-2 sm:mx-3 mt-[-20px] transition-all duration-500 rounded-full",
                  stepNum < currentStep
                    ? "bg-gradient-to-r from-emerald-500 to-indigo-500"
                    : "bg-black/5 dark:bg-white/10"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
