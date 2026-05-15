import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  loan: mongoose.Types.ObjectId;
  borrower: mongoose.Types.ObjectId;
  utrNumber: string;
  amount: number;
  paymentDate: Date;
  recordedBy: mongoose.Types.ObjectId;
  outstandingAfter: number;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    loan: { type: Schema.Types.ObjectId, ref: "Loan", required: true, index: true },
    borrower: { type: Schema.Types.ObjectId, ref: "User", required: true },
    utrNumber: { type: String, required: true, unique: true, trim: true },
    amount: { type: Number, required: true, min: 1 },
    paymentDate: { type: Date, required: true },
    recordedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    outstandingAfter: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);
