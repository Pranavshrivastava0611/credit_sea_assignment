"use client";
import { useState, useCallback } from "react";
import api from "@/lib/api";
import { Loan, Payment, BREResult, PaginationInfo } from "@/types";
import toast from "react-hot-toast";

export function useLoan() {
  const [loading, setLoading] = useState(false);

  const breCheck = useCallback(async (data: {
    dateOfBirth: string;
    monthlySalary: number;
    pan: string;
    employmentMode: string;
  }): Promise<BREResult> => {
    setLoading(true);
    try {
      const { data: res } = await api.post("/borrower/bre-check", data);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadSalarySlip = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("salarySlip", file);
    const { data } = await api.post("/borrower/upload-salary-slip", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  }, []);

  const applyForLoan = useCallback(async (applicationData: any) => {
    setLoading(true);
    try {
      const { data } = await api.post("/borrower/apply", applicationData);
      toast.success("Loan application submitted!");
      return data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMyLoans = useCallback(async (page = 1, limit = 10): Promise<{
    loans: Loan[];
    pagination: PaginationInfo;
  }> => {
    const { data } = await api.get(`/borrower/my-loans?page=${page}&limit=${limit}`);
    return data.data;
  }, []);

  const getLeads = useCallback(async (page = 1, limit = 10, search = "") => {
    const { data } = await api.get(`/sales/leads?page=${page}&limit=${limit}&search=${search}`);
    return data.data;
  }, []);

  const getAppliedLoans = useCallback(async (page = 1, limit = 10) => {
    const { data } = await api.get(`/sanction/loans?page=${page}&limit=${limit}`);
    return data.data;
  }, []);

  const approveLoan = useCallback(async (loanId: string) => {
    const { data } = await api.patch(`/sanction/loans/${loanId}/approve`);
    toast.success("Loan approved!");
    return data.data;
  }, []);

  const rejectLoan = useCallback(async (loanId: string, rejectionReason: string) => {
    const { data } = await api.patch(`/sanction/loans/${loanId}/reject`, { rejectionReason });
    toast.success("Loan rejected");
    return data.data;
  }, []);

  const getSanctionedLoans = useCallback(async (page = 1, limit = 10) => {
    const { data } = await api.get(`/disbursement/loans?page=${page}&limit=${limit}`);
    return data.data;
  }, []);

  const disburseLoan = useCallback(async (loanId: string) => {
    const { data } = await api.patch(`/disbursement/loans/${loanId}/disburse`);
    toast.success("Loan disbursed!");
    return data.data;
  }, []);

  const getDisbursedLoans = useCallback(async (page = 1, limit = 10) => {
    const { data } = await api.get(`/collection/loans?page=${page}&limit=${limit}`);
    return data.data;
  }, []);

  const recordPayment = useCallback(async (loanId: string, paymentData: {
    utrNumber: string;
    amount: number;
    paymentDate: string;
  }) => {
    const { data } = await api.post(`/collection/loans/${loanId}/payment`, paymentData);
    toast.success(data.message);
    return data.data;
  }, []);

  const getPaymentHistory = useCallback(async (loanId: string) => {
    const { data } = await api.get(`/collection/loans/${loanId}/payments`);
    return data.data;
  }, []);

  const getAllLoans = useCallback(async (page = 1, limit = 10, status = "") => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append("status", status);
    const { data } = await api.get(`/admin/all-loans?${params}`);
    return data.data;
  }, []);

  const getAllUsers = useCallback(async (page = 1, limit = 10, role = "") => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (role) params.append("role", role);
    const { data } = await api.get(`/admin/all-users?${params}`);
    return data.data;
  }, []);

  return {
    loading,
    breCheck,
    uploadSalarySlip,
    applyForLoan,
    getMyLoans,
    getLeads,
    getAppliedLoans,
    approveLoan,
    rejectLoan,
    getSanctionedLoans,
    disburseLoan,
    getDisbursedLoans,
    recordPayment,
    getPaymentHistory,
    getAllLoans,
    getAllUsers,
  };
}
