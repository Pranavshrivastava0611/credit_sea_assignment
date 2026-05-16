"use client";
import { cn } from "@/lib/utils";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  className?: string;
}

export default function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  className,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold" style={{ color: "rgb(var(--color-text-secondary))" }}>{label}</label>
        <span className="text-xl font-bold font-mono" style={{ color: "rgb(var(--color-text))" }}>
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:shadow-primary/30
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-white
            [&::-moz-range-thumb]:w-6
            [&::-moz-range-thumb]:h-6
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-primary
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-white
            [&::-moz-range-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right, rgb(var(--color-primary)) 0%, rgb(var(--color-primary)) ${percentage}%, rgb(var(--color-bg-secondary)) ${percentage}%, rgb(var(--color-bg-secondary)) 100%)`,
          }}
        />
        <div className="flex justify-between mt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgb(var(--color-text-muted))" }}>{formatValue ? formatValue(min) : min}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgb(var(--color-text-muted))" }}>{formatValue ? formatValue(max) : max}</span>
        </div>
      </div>
    </div>
  );
}
