"use client";
import { create } from "zustand";
import { LoanApplicationData } from "@/types";

interface LoanStore {
  currentStep: number;
  applicationData: Partial<LoanApplicationData>;
  breChecked: boolean;
  setStep: (step: number) => void;
  updateApplicationData: (data: Partial<LoanApplicationData>) => void;
  setBREChecked: (checked: boolean) => void;
  resetApplication: () => void;
}

export const useLoanStore = create<LoanStore>()((set) => ({
  currentStep: 1,
  applicationData: {},
  breChecked: false,
  setStep: (step) => set({ currentStep: step }),
  updateApplicationData: (data) =>
    set((state) => ({
      applicationData: { ...state.applicationData, ...data },
    })),
  setBREChecked: (checked) => set({ breChecked: checked }),
  resetApplication: () =>
    set({ currentStep: 1, applicationData: {}, breChecked: false }),
}));
