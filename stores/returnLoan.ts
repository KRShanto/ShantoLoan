import { LoanType } from "@/types/loan";
import { create } from "zustand";

interface ReturnLoanState {
  returnLoan: LoanType | null;
  setReturnLoan: (loan: LoanType | null) => void;
}

const useReturnLoanStore = create<ReturnLoanState>((set) => ({
  returnLoan: null,
  setReturnLoan: (loan) => set({ returnLoan: loan }),
}));

export default useReturnLoanStore;
