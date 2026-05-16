"use client";
import { motion } from "framer-motion";
import { BREResult } from "@/types";

interface BREResultDisplayProps {
  result: BREResult | null;
}

export default function BREResultDisplay({ result }: BREResultDisplayProps) {
  if (!result) return null;

  if (result.passed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shadow-inner">
            <svg className="w-7 h-7 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h4 className="text-emerald-700 dark:text-emerald-400 font-bold">Eligibility Check Passed!</h4>
            <p className="text-emerald-600/80 dark:text-emerald-400/70 text-sm font-medium">You meet all the criteria. Proceed to upload your salary slip.</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-500/10 border border-red-500/20 rounded-xl p-5"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-inner">
          <svg className="w-7 h-7 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <h4 className="text-red-700 dark:text-red-400 font-bold">Eligibility Check Failed</h4>
          <ul className="mt-2 space-y-2">
            {result.failedRules.map((rule, i) => (
              <li key={i} className="text-red-600/90 dark:text-red-400/80 text-sm flex items-start gap-2 font-medium">
                <span className="text-red-500 mt-1 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
