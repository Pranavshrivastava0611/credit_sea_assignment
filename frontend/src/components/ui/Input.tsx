"use client";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefix?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, prefix, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium" style={{ color: "rgb(var(--color-text-secondary))" }}>
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "input-dark",
              prefix && "pl-8",
              error && "border-red-500/50 focus:ring-red-500",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-400 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
