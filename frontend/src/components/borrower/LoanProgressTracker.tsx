"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  label: string;
  status: "upcoming" | "current" | "complete" | "failed";
  description: string;
}

interface LoanProgressTrackerProps {
  status: string;
}

export default function LoanProgressTracker({ status }: LoanProgressTrackerProps) {
  const getSteps = (currentStatus: string): Step[] => {
    const isRejected = currentStatus === "REJECTED";
    const isClosed = currentStatus === "CLOSED";
    
    const steps: Step[] = [
      {
        id: "APPLIED",
        label: "Applied",
        description: "Application submitted",
        status: "complete"
      },
      {
        id: "SANCTIONED",
        label: "Verification",
        description: isRejected ? "Application Rejected" : "Sanctioned & Approved",
        status: isRejected ? "failed" : 
                (["SANCTIONED", "DISBURSED", "CLOSED"].includes(currentStatus) ? "complete" : 
                 (currentStatus === "APPLIED" ? "current" : "upcoming"))
      },
      {
        id: "DISBURSED",
        label: "Funding",
        description: "Funds Disbursed",
        status: isRejected ? "upcoming" :
                (["DISBURSED", "CLOSED"].includes(currentStatus) ? "complete" : 
                 (currentStatus === "SANCTIONED" ? "current" : "upcoming"))
      },
      {
        id: "CLOSED",
        label: "Completion",
        description: "Loan fully repaid",
        status: isRejected ? "upcoming" :
                (currentStatus === "CLOSED" ? "complete" : 
                 (currentStatus === "DISBURSED" ? "current" : "upcoming"))
      }
    ];

    return steps;
  };

  const steps = getSteps(status);

  return (
    <div className="py-6 px-2">
      <div className="relative flex justify-between">
        {/* Connection Line */}
        <div className="absolute top-5 left-0 w-full h-[2px] bg-black/5 dark:bg-white/5" />
        
        {/* Active Line */}
        <motion.div 
          className="absolute top-5 left-0 h-[2px] bg-primary origin-left"
          initial={{ scaleX: 0 }}
          animate={{ 
            scaleX: status === "APPLIED" ? 0.125 :
                   status === "SANCTIONED" ? 0.375 :
                   status === "DISBURSED" ? 0.625 :
                   status === "CLOSED" ? 1 : 0.375 // For rejected, stop at verification
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {steps.map((step, idx) => {
          const isComplete = step.status === "complete";
          const isCurrent = step.status === "current";
          const isFailed = step.status === "failed";

          return (
            <div key={step.id} className="relative flex flex-col items-center z-10 w-1/4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
                  isComplete && "bg-primary border-primary text-white shadow-lg shadow-primary/20",
                  isCurrent && "bg-white dark:bg-dark-100 border-primary text-primary shadow-lg shadow-primary/20",
                  isFailed && "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20",
                  !isComplete && !isCurrent && !isFailed && "bg-white dark:bg-dark-100 border-black/10 dark:border-white/10 text-gray-400"
                )}
              >
                {isComplete ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : isFailed ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <span className="text-xs font-bold">{idx + 1}</span>
                )}
              </motion.div>
              
              <div className="mt-3 text-center">
                <p className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  isCurrent ? "text-primary" : (isFailed ? "text-red-500" : "text-gray-500")
                )}>
                  {step.label}
                </p>
                <p className="text-[9px] mt-0.5 opacity-60 hidden md:block" style={{ color: "rgb(var(--color-text-muted))" }}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
