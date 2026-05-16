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
        className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h4 className="text-emerald-400 font-semibold">Eligibility Check Passed!</h4>
            <p className="text-emerald-400/70 text-sm">You meet all the criteria. Proceed to upload your salary slip.</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-500/10 border border-red-500/30 rounded-xl p-5"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <h4 className="text-red-400 font-semibold">Eligibility Check Failed</h4>
          <ul className="mt-2 space-y-1.5">
            {result.failedRules.map((rule, i) => (
              <li key={i} className="text-red-400/80 text-sm flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
