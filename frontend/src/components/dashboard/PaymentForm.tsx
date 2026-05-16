"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import DatePicker from "@/components/ui/DatePicker";

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { utrNumber: string; amount: number; paymentDate: string }) => Promise<void>;
  maxAmount: number;
  loanId: string;
}

export default function PaymentForm({ isOpen, onClose, onSubmit, maxAmount }: PaymentFormProps) {
  const [utrNumber, setUtrNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!utrNumber.trim()) {
      setError("UTR number is required");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (Number(amount) > maxAmount) {
      setError(`Amount cannot exceed outstanding balance of ₹${maxAmount.toFixed(2)}`);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        utrNumber: utrNumber.trim(),
        amount: Number(amount),
        paymentDate,
      });
      setUtrNumber("");
      setAmount("");
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Payment recording failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Payment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="UTR Number"
          id="utr-number"
          value={utrNumber}
          onChange={(e) => setUtrNumber(e.target.value)}
          placeholder="Enter unique transaction reference"
        />
        <Input
          label={`Amount (Max: ₹${maxAmount.toFixed(2)})`}
          id="payment-amount"
          type="number"
          prefix="₹"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          min={1}
          max={maxAmount}
        />
        <DatePicker
          label="Payment Date"
          id="payment-date"
          selected={paymentDate ? new Date(paymentDate) : null}
          onChange={(date) => setPaymentDate(date ? date.toISOString().split("T")[0] : "")}
          maxDate={new Date()}
        />

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            Record Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
}
