"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useAuthStore } from "@/store/auth.store";
import { useLoanStore } from "@/store/loan.store";
import { useLoan } from "@/hooks/useLoan";
import { useAuth } from "@/hooks/useAuth";
import StepIndicator from "@/components/borrower/StepIndicator";
import BREResultDisplay from "@/components/borrower/BREResult";
import LoanCalculator from "@/components/borrower/LoanCalculator";
import FileUpload from "@/components/borrower/FileUpload";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import DatePicker from "@/components/ui/DatePicker";
import Slider from "@/components/ui/Slider";
import Card from "@/components/ui/Card";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { BREResult } from "@/types";
import { formatCurrency, calculateSimpleInterest } from "@/lib/utils";
import toast from "react-hot-toast";

const ReactConfetti = dynamic(() => import("react-confetti"), { ssr: false });

const STEPS = ["Personal Details", "Salary Slip", "Loan Configuration"];

export default function ApplyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { currentStep, applicationData, breChecked, setStep, updateApplicationData, setBREChecked, resetApplication } = useLoanStore();
  const { breCheck, uploadSalarySlip, applyForLoan, loading } = useLoan();

  // Step 1 state
  const [fullName, setFullName] = useState(applicationData.fullName || "");
  const [pan, setPan] = useState(applicationData.pan || "");
  const [dateOfBirth, setDateOfBirth] = useState(applicationData.dateOfBirth || "");
  const [monthlySalary, setMonthlySalary] = useState(applicationData.monthlySalary || 0);
  const [employmentMode, setEmploymentMode] = useState<"Salaried" | "Self-Employed" | "Unemployed">(applicationData.employmentMode || "Salaried");
  const [breResult, setBREResult] = useState<BREResult | null>(null);
  const [step1Loading, setStep1Loading] = useState(false);

  // Step 2 state
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; url: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  // Step 3 state
  const [principal, setPrincipal] = useState(applicationData.principal || 100000);
  const [tenureDays, setTenureDays] = useState(applicationData.tenureDays || 180);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (user && user.role !== "Borrower") {
      router.push("/");
    }
  }, [user, router]);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep1Loading(true);
    try {
      const result = await breCheck({
        dateOfBirth,
        monthlySalary: Number(monthlySalary),
        pan: pan.toUpperCase(),
        employmentMode,
      });
      setBREResult(result);

      if (result.passed) {
        updateApplicationData({
          fullName,
          pan: pan.toUpperCase(),
          dateOfBirth,
          monthlySalary: Number(monthlySalary),
          employmentMode: employmentMode as any,
        });
        setBREChecked(true);
        setTimeout(() => setStep(2), 1500);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "BRE check failed");
    } finally {
      setStep1Loading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadSalarySlip(file);
      setUploadedFile({ name: result.fileName, size: result.size, url: result.url });
      updateApplicationData({
        salarySlipUrl: result.url,
        salarySlipFileName: result.fileName,
      });
      toast.success("File uploaded!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleApply = async () => {
    try {
      const loanCalc = calculateSimpleInterest(principal, tenureDays);
      await applyForLoan({
        ...applicationData,
        principal,
        tenureDays,
        ...loanCalc,
      });
      setShowConfetti(true);
      resetApplication();
      setTimeout(() => {
        router.push("/borrower-dashboard");
      }, 3000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Application failed");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "rgb(var(--color-bg))" }}>
      {showConfetti && <ReactConfetti recycle={false} numberOfPieces={500} />}
      
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 py-10 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => router.push("/borrower-dashboard")}
              className="text-sm transition-colors inline-flex items-center gap-1 font-medium"
              style={{ color: "rgb(var(--color-text-muted))" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <ThemeToggle />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: "rgb(var(--color-text))" }}>Apply for a Loan</h1>
          <p className="mt-2" style={{ color: "rgb(var(--color-text-muted))" }}>Complete the steps below to submit your application</p>
        </div>

        <StepIndicator currentStep={currentStep} steps={STEPS} />

        <AnimatePresence mode="wait">
          {/* STEP 1: Personal Details */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card highlight>
                <h2 className="text-lg font-bold mb-6" style={{ color: "rgb(var(--color-text))" }}>Personal Details</h2>
                <form onSubmit={handleStep1Submit} className="space-y-6">
                  <Input
                    label="Full Name"
                    id="apply-fullname"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                  <Input
                    label="PAN Number"
                    id="apply-pan"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    placeholder="AAAAA9999A"
                    maxLength={10}
                    required
                  />
                  <DatePicker
                    label="Date of Birth"
                    id="apply-dob"
                    selected={dateOfBirth ? new Date(dateOfBirth) : null}
                    onChange={(date) => setDateOfBirth(date ? date.toISOString().split("T")[0] : "")}
                    required
                    maxDate={new Date()}
                  />
                  <Input
                    label="Monthly Salary"
                    id="apply-salary"
                    type="number"
                    prefix="₹"
                    value={monthlySalary || ""}
                    onChange={(e) => setMonthlySalary(Number(e.target.value))}
                    placeholder="25000"
                    required
                  />

                  {/* Employment Mode */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{ color: "rgb(var(--color-text-secondary))" }}>Employment Mode</label>
                    <div className="flex gap-3">
                      {["Salaried", "Self-Employed", "Unemployed"].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setEmploymentMode(mode as any)}
                          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 border ${
                            employmentMode === mode
                              ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                              : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                          }`}
                          style={employmentMode !== mode ? {
                            background: "rgb(var(--color-bg-secondary))",
                            borderColor: "var(--glass-border)",
                            color: "rgb(var(--color-text-secondary))"
                          } : undefined}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  <BREResultDisplay result={breResult} />

                  <Button type="submit" loading={step1Loading} className="w-full shadow-lg shadow-primary/25" size="lg">
                    Check Eligibility
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}

          {/* STEP 2: Salary Slip */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card highlight>
                <h2 className="text-lg font-bold mb-6" style={{ color: "rgb(var(--color-text))" }}>Upload Salary Slip</h2>
                <FileUpload
                  onFileSelect={handleFileUpload}
                  uploading={uploading}
                  uploadProgress={uploading ? 50 : 0}
                  uploadedFile={uploadedFile}
                  onRemove={() => setUploadedFile(null)}
                />

                <div className="flex gap-3 mt-8">
                  <Button variant="ghost" onClick={() => setStep(1)} className="flex-1 dark:text-white">
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!uploadedFile}
                    className="flex-1 shadow-lg shadow-primary/20"
                  >
                    Continue
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* STEP 3: Loan Configuration */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card highlight>
                <h2 className="text-lg font-bold mb-6" style={{ color: "rgb(var(--color-text))" }}>Configure Your Loan</h2>

                <div className="space-y-8 mb-10">
                  <Slider
                    label="Loan Amount"
                    value={principal}
                    min={50000}
                    max={500000}
                    step={10000}
                    onChange={setPrincipal}
                    formatValue={(v) => formatCurrency(v)}
                  />

                  <Slider
                    label="Tenure"
                    value={tenureDays}
                    min={30}
                    max={365}
                    step={1}
                    onChange={setTenureDays}
                    formatValue={(v) => `${v} days`}
                  />
                </div>

                <LoanCalculator principal={principal} tenureDays={tenureDays} />

                <div className="flex gap-3 mt-10">
                  <Button variant="ghost" onClick={() => setStep(2)} className="flex-1 dark:text-white">
                    Back
                  </Button>
                  <Button
                    onClick={handleApply}
                    loading={loading}
                    className="flex-1 shadow-xl shadow-primary/30"
                    size="lg"
                  >
                    🎉 Apply for Loan
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success overlay */}
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
            style={{ background: "rgb(var(--color-bg) / 0.8)" }}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30"
              >
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: "rgb(var(--color-text))" }}>Application Submitted!</h2>
              <p style={{ color: "rgb(var(--color-text-secondary))" }}>Redirecting to your dashboard...</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
