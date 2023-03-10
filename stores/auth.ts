import { create } from "zustand";

interface AuthState {
  username: string;
  password: string;
  setup: (username: string, password: string) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  username: "",
  password: "",
  setup: (username, password) => set({ username, password }),
}));

export default useAuthStore;
