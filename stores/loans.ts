import { LoanType } from "@/types/loan";
import { create } from "zustand";

interface LoansState {
  loans: LoanType[];
  setLoans: (loans: LoanType[]) => void;
  addLoan: (loan: LoanType) => void;
}

const useLoansStore = create<LoansState>((set) => ({
  loans: [],
  setLoans: (loans) => set({ loans }),
  addLoan: (loan) => set((state) => ({ loans: [...state.loans, loan] })),
}));

export default useLoansStore;
