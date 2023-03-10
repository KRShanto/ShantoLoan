import mongoose, { Schema } from "mongoose";
import { LoanType } from "../types/loan";

const loanSchema = new Schema<LoanType>({
  why: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  user: {
    _id: { type: String, required: true },
    name: { type: String, required: true },
  },
  returnDate: { type: Date, required: false },
});

const Loan =
  mongoose.models.Loan || mongoose.model<LoanType>("Loan", loanSchema);

export default Loan;
