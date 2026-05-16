"use client";
import React, { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  id?: string;
  required?: boolean;
  maxDate?: Date;
  minDate?: Date;
  showYearDropdown?: boolean;
  scrollableYearDropdown?: boolean;
  yearDropdownItemNumber?: number;
}

const DatePicker = forwardRef<ReactDatePicker, DatePickerProps>(
  (
    {
      selected,
      onChange,
      label,
      placeholder = "Select date",
      error,
      id,
      required,
      maxDate,
      minDate,
      showYearDropdown = true,
      scrollableYearDropdown = true,
      yearDropdownItemNumber = 100,
    },
    ref
  ) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium"
            style={{ color: "rgb(var(--color-text-secondary))" }}
          >
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative group custom-datepicker-wrapper">
          <ReactDatePicker
            id={id}
            selected={selected}
            onChange={onChange}
            placeholderText={placeholder}
            dateFormat="dd/MM/yyyy"
            maxDate={maxDate}
            minDate={minDate}
            showYearDropdown={showYearDropdown}
            scrollableYearDropdown={scrollableYearDropdown}
            yearDropdownItemNumber={yearDropdownItemNumber}
            className={cn(
              "input-dark w-full pr-10",
              error && "border-red-500/50 focus:ring-red-500"
            )}
            wrapperClassName="w-full"
            ref={ref}
            autoComplete="off"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-primary transition-colors">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}

        <style jsx global>{`
          .react-datepicker {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border) !important;
            border-radius: 20px !important;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3) !important;
            color: rgb(var(--color-text)) !important;
            font-family: inherit !important;
            overflow: hidden;
            padding: 12px;
            animation: datePickerFadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          @keyframes datePickerFadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .react-datepicker__header {
            background: transparent !important;
            border-bottom: 1px solid var(--glass-border) !important;
            padding-bottom: 12px !important;
            margin-bottom: 8px !important;
          }
          .react-datepicker__current-month {
            color: rgb(var(--color-text)) !important;
            font-weight: 800 !important;
            font-size: 1.1rem !important;
            text-transform: capitalize;
          }
          .react-datepicker__day-names {
            margin-top: 8px !important;
          }
          .react-datepicker__day-name {
            color: rgb(var(--color-text-muted)) !important;
            font-weight: 700 !important;
            width: 2.5rem !important;
          }
          .react-datepicker__day {
            color: rgb(var(--color-text)) !important;
            border-radius: 12px !important;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
            font-weight: 600 !important;
            width: 2.5rem !important;
            line-height: 2.5rem !important;
            margin: 2px !important;
            font-size: 0.95rem !important;
          }
          .react-datepicker__day:hover {
            background: #6366f1 !important;
            color: white !important;
            transform: scale(1.1);
            z-index: 1;
          }
          .react-datepicker__day--selected,
          .react-datepicker__day--keyboard-selected {
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%) !important;
            color: white !important;
            font-weight: 800 !important;
            box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4) !important;
            transform: scale(1.05);
          }
          .react-datepicker__day--today {
            color: #6366f1 !important;
            border: 2px solid #6366f1 !important;
            background: transparent !important;
          }
          .react-datepicker__navigation {
            top: 18px !important;
          }
          .react-datepicker__navigation-icon::before {
            border-color: rgb(var(--color-text-muted)) !important;
            border-width: 3px 3px 0 0 !important;
          }
          .react-datepicker__navigation:hover *::before {
            border-color: #6366f1 !important;
          }

          /* Year/Month Selection */
          .react-datepicker__header__dropdown {
            margin: 10px 0 !important;
            display: flex;
            justify-content: center;
            gap: 8px;
          }
          .react-datepicker__year-read-view,
          .react-datepicker__month-read-view {
             color: rgb(var(--color-text)) !important;
             font-weight: 600 !important;
             padding: 4px 8px !important;
             border-radius: 6px !important;
             background: rgba(var(--color-text), 0.05) !important;
          }

          .react-datepicker__year-dropdown,
          .react-datepicker__month-dropdown {
             background: var(--color-bg-elevated) !important;
             background-color: rgb(var(--color-bg-card)) !important;
             border: 1px solid var(--glass-border) !important;
             border-radius: 12px !important;
             box-shadow: var(--glass-shadow) !important;
          }

          .react-datepicker__year-option,
          .react-datepicker__month-option {
             padding: 8px !important;
             color: rgb(var(--color-text)) !important;
             transition: background 0.2s !important;
          }
          .react-datepicker__year-option:hover,
          .react-datepicker__month-option:hover {
             background: #6366f1 !important;
             color: white !important;
          }

          .react-datepicker__year-select,
          .react-datepicker__month-select {
             background: rgba(var(--color-text), 0.05) !important;
             color: rgb(var(--color-text)) !important;
             border: 1px solid var(--glass-border) !important;
             border-radius: 8px !important;
             padding: 4px 8px !important;
             cursor: pointer;
             font-weight: 600;
          }

          .react-datepicker__month-container {
            width: 100%;
          }
          .react-datepicker {
             min-width: 340px;
          }

        `}</style>
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
