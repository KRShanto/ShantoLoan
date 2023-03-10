import { UserType } from "@/types/user";
import { create } from "zustand";

interface UsersState {
  users: UserType[];
  setUsers: (users: UserType[]) => void;
  addUser: (user: UserType) => void;
}

const useUsersStore = create<UsersState>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
}));

export default useUsersStore;
