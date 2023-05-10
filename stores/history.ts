import { LoanReturnType } from "@/types/loan";
import { create } from "zustand";

interface HistoryState {
  history: LoanReturnType[] | null;
  setHistory: (history: LoanReturnType[]) => void;
}

const useHistoryStore = create<HistoryState>((set) => ({
  history: null,
  setHistory: (history) => set({ history }),
}));

export default useHistoryStore;
